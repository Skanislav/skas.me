#!/usr/bin/env node
// Pin the static export in `out/` to IPFS via Pinata and write the folder CID to `.cid`.
//
// Why this works for ENS/eth.limo root serving:
// Pinata's `fileArray` derives each entry's in-directory path from `file.webkitRelativePath`
// (see node_modules/pinata -> uploadFileArray). By setting that to each file's path *relative
// to out/* (no wrapper prefix), the resulting CID's root IS the site root, so `ipfs://<cid>/`
// resolves `index.html` directly. Leaving it unset would nest everything under a folder and
// break root access.
//
// Required env: PINATA_JWT
// Optional env: PINATA_GATEWAY (dedicated gateway host, e.g. my-gw.mypinata.cloud)

import { readdir, readFile } from 'node:fs/promises'
import { existsSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { PinataSDK } from 'pinata'

const OUT_DIR = 'out'
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
    const rel = relative(base, full).split(sep).join('/')
    const bytes = await readFile(full)
    const file = new File([bytes], entry.name)
    // The in-directory path used to build the IPFS folder. Relative to out/ => CID root = site root.
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
