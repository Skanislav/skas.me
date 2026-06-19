import {getAllPosts} from '@/lib/posts'

// Emitted as a static file (out/feed.xml) under `output: 'export'`.
export const dynamic = 'force-static'

// Absolute origin for the feed's links. Defaults to the canonical host (skas.me,
// served by Vercel); override NEXT_PUBLIC_SITE_URL per deploy, e.g.
// https://<name>.eth.limo for the IPFS/ENS build.
// `||` (not `??`) so a blank env value also falls back to the default.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://skas.me').replace(/\/+$/, '')
const FEED_TITLE = 'Fellowship Notes'
const FEED_DESCRIPTION = 'A weekly log from inside the Ethereum Protocol Fellowship — reading, building, and getting things wrong.'

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

// "May 25, 2025" -> RFC-822 date. Posts without a parseable date omit pubDate.
function toRfc822(dateLong?: string): string | undefined {
    if (!dateLong) return undefined
    const d = new Date(dateLong)
    return Number.isNaN(d.getTime()) ? undefined : d.toUTCString()
}

export async function GET() {
    const posts = await getAllPosts()

    const items = posts.map((post) => {
        const link = `${SITE_URL}/epf/${post.slug}/`
        const pubDate = toRfc822(post.dateLong)
        return [
            '    <item>',
            `      <title>${escapeXml(post.title ?? post.slug)}</title>`,
            `      <link>${link}</link>`,
            `      <guid isPermaLink="true">${link}</guid>`,
            pubDate ? `      <pubDate>${pubDate}</pubDate>` : '',
            post.summary ? `      <description>${escapeXml(post.summary)}</description>` : '',
            '    </item>',
        ].filter(Boolean).join('\n')
    }).join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/epf/</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`

    return new Response(xml, {
        headers: {'Content-Type': 'application/xml; charset=utf-8'},
    })
}
