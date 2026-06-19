import Link from 'next/link'
import React from 'react'

import {getAllPosts, getPostSlugs, PostMeta} from '@/lib/posts'
import prose from '@/components/prose.module.css'
import styles from './post.module.css'

// Enumerate every post at build time so each gets its own static HTML page.
// Required for `output: 'export'` — dynamic routes can't be rendered on-demand on IPFS.
export function generateStaticParams() {
    return getPostSlugs().map((postName) => ({postName}));
}

// Only the params returned above are valid; anything else 404s instead of rendering at runtime.
export const dynamicParams = false;

// "WEEK 06 · May 25, 2025 · 7 min" — built from whatever metadata the post provides.
function buildEyebrow(meta: PostMeta): string {
    return [
        meta.week ? `WEEK ${meta.week}` : null,
        meta.dateLong,
        meta.readingTime,
    ].filter(Boolean).join(' · ');
}

export default async function BlogPost({params}: { params: Promise<{ postName: string }> }) {
    const {postName} = await params;
    const {default: Post, meta: rawMeta} = (await import(`@/posts/epf/${postName}.mdx`)) as {
        default: React.ComponentType
        meta?: PostMeta
    };
    const meta: PostMeta = rawMeta ?? {};

    // Newest-first ordering: the next-older post sits one further down the list.
    const posts = await getAllPosts();
    const idx = posts.findIndex((p) => p.slug === postName);
    const older = idx >= 0 ? posts[idx + 1] : undefined;
    const newer = idx > 0 ? posts[idx - 1] : undefined;

    const eyebrow = buildEyebrow(meta);

    return (
        <main className={styles.main}>
            <div className={styles.backWrap}>
                <Link href="/epf" className={styles.back}>
                    <span>&larr;</span> Notes
                </Link>
            </div>

            {meta.title && (
                <header className={styles.header}>
                    {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
                    <h1 className={styles.title}>{meta.title}</h1>
                </header>
            )}

            <article className={prose.prose}>
                <Post/>
            </article>

            <nav className={styles.nav}>
                <div className={styles.navSlot}>
                    {older && (
                        <Link href={`/epf/${older.slug}`} className={styles.navLink}>
                            <div className={styles.navLabel}>
                                &larr; OLDER{older.label ? ` · ${older.label}` : ''}
                            </div>
                            <div className={styles.navTitle}>{older.title ?? older.slug}</div>
                        </Link>
                    )}
                </div>
                <div className={`${styles.navSlot} ${styles.navSlotNewer}`}>
                    {newer && (
                        <Link href={`/epf/${newer.slug}`} className={styles.navLink}>
                            <div className={styles.navLabel}>
                                NEWER{newer.label ? ` · ${newer.label}` : ''} &rarr;
                            </div>
                            <div className={styles.navTitle}>{newer.title ?? newer.slug}</div>
                        </Link>
                    )}
                </div>
            </nav>
        </main>
    )
}
