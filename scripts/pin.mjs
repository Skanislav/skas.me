#!/usr/bin/env node
// Pin the static export in `out/` to IPFS via Pinata and write the folder CID to `.cid`.
//
// Why this works for ENS/eth.limo root serving:
// Pinata's `fileArray` builds the IPFS directory from each entry's `file.webkitRelativePath`
// (see node_modules/pinata -> uploadFileArray). Every file MUST sit under one common wrapper
// folder, otherwise the `pinFileToIPFS` API rejects the upload with "More than one file
// and/or directory was provided for pinning." Pinata returns the CID of that wrapper folder,
// and since the wrapper IS the directory whose CID is returned, `ipfs://<cid>/` still resolves
// `index.html` at the root (the wrapper name never appears in the path) — exactly like
// `ipfs add -r out` returning the CID of `out` itself.
//
// Required env: PINATA_JWT
// Optional env: PINATA_GATEWAY (dedicated gateway host, e.g. my-gw.mypinata.cloud)

import { readdir, readFile } from 'node:fs/promises'
import { existsSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { PinataSDK } from 'pinata'

const OUT_DIR = 'out'
// Common wrapper folder so Pinata sees a single directory (its name is consumed as the
// returned CID's root and never appears in served URLs).
const WRAPPER = 'site'
const JWT = process.env.PINATA_JWT
const GATEWAY = process.env.PINATA_GATEWAY

if (!JWT) {
  console.error('✗ Missing PINATA_JWT. Create a JWT at https://app.pinata.cloud (API Keys) and set it in .env.')
  process.exit(1)
}
if (!existsSync(OUT_DIR)) {
  console.error(`✗ No ${OUT_DIR}/ directory. Run \`npm run build\` first.`)
  process.exit(1)
}

async function collectFiles(dir, base) {
  const files = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full, base)))
      continue
    }
    // Path under the common wrapper, e.g. site/index.html, site/epf/index.html.
    const rel = WRAPPER + '/' + relative(base, full).split(sep).join('/')
    const bytes = await readFile(full)
    const file = new File([bytes], entry.name)
    Object.defineProperty(file, 'webkitRelativePath', { value: rel })
    files.push(file)
  }
  return files
}

const files = await collectFiles(OUT_DIR, OUT_DIR)
console.log(`Pinning ${files.length} files from ${OUT_DIR}/ to IPFS via Pinata…`)

const pinata = new PinataSDK({ pinataJwt: JWT, pinataGateway: GATEWAY })
const res = await pinata.upload.public.fileArray(files)
const cid = res.cid

writeFileSync('.cid', cid + '\n')

console.log(`\n✅ Pinned ${(res.size / 1024).toFixed(1)} KB. CID: ${cid}`)
console.log(`   (saved to .cid for the ENS step)\n`)
console.log('Preview the deployment:')
if (GATEWAY) console.log(`   https://${GATEWAY}/ipfs/${cid}/`)
console.log(`   https://dweb.link/ipfs/${cid}/`)
console.log(`   https://${cid}.ipfs.dweb.link/`)
console.log('\nVerify index.html resolves at the ROOT of the CID before pointing ENS at it.')
console.log(`Then set the ENS contenthash to ipfs://${cid} in the ENS app (app.ens.domains).`)
