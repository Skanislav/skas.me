import fs from 'fs'
import path from 'path'

// Metadata a post may export from its MDX file via `export const meta = {...}`.
// Everything is optional: a bare MDX file (no meta) still renders gracefully.
export type PostMeta = {
    // Short ledger label, e.g. "W06". Omit for posts that aren't weekly entries.
    label?: string
    // Week number shown in the reading-view header, e.g. "06".
    week?: string
    title?: string
    date?: string
    dateLong?: string
    readingTime?: string
    summary?: string
    tags?: string[]
    // Higher sorts first (newest). Defaults to 0 when absent.
    order?: number
}

export type Post = PostMeta & {
    slug: string
}

const postsDirectory = path.join(process.cwd(), 'posts', 'epf')

// Readable title from a filename slug, e.g. "why-am-i-here" -> "Why Am I Here".
// Used only as a display fallback for posts that don't export a `title`.
function humanize(slug: string): string {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export function getPostSlugs(): string[] {
    return fs
        .readdirSync(postsDirectory)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => file.replace(/\.mdx$/, ''))
}

// Loads every post's metadata, newest first. The dynamic import is the same
// contextual pattern the post page uses, so it works under `output: 'export'`.
export async function getAllPosts(): Promise<Post[]> {
    const slugs = getPostSlugs()

    const posts = await Promise.all(
        slugs.map(async (slug): Promise<Post> => {
            const mod = (await import(`@/posts/epf/${slug}.mdx`)) as {meta?: PostMeta}
            const meta: PostMeta = mod.meta ?? {}
            return {slug, ...meta, title: meta.title ?? humanize(slug)}
        })
    )

    return posts.sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
}
