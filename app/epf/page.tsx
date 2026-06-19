import Link from 'next/link'

import {getAllPosts} from '@/lib/posts'
import styles from './index.module.css'

export const metadata = {
    title: 'Fellowship Notes',
    description: 'A weekly log from inside the Ethereum Protocol Fellowship — reading, building, and getting things wrong.',
    alternates: {
        types: {
            'application/rss+xml': '/feed.xml',
        },
    },
}

export default async function BlogPage() {
    const posts = await getAllPosts()

    return (
        <main className={styles.main}>
            <section className={styles.masthead}>
                <div className={styles.kicker}>ETHEREUM PROTOCOL FELLOWSHIP · 2025</div>
                <h1 className={styles.title}>Fellowship Notes</h1>
                <p className={styles.intro}>
                    A weekly log from inside the protocol fellowship — what I&rsquo;m reading, building, and getting
                    wrong. Written in Markdown, published every Sunday.
                </p>
            </section>

            <div className={styles.list}>
                {posts.map((post) => (
                    <Link key={post.slug} href={`/epf/${post.slug}`} className={styles.row}>
                        <div className={styles.meta}>
                            {post.label ? `${post.label} · ` : ''}{post.date ?? ''}
                        </div>
                        <div className={styles.body}>
                            <h2 className={styles.postTitle}>{post.title ?? post.slug}</h2>
                            {post.summary && <p className={styles.summary}>{post.summary}</p>}
                        </div>
                        {post.readingTime && <div className={styles.readingTime}>{post.readingTime}</div>}
                    </Link>
                ))}
            </div>

            <footer className={styles.footer}>
                <span>Markdown · published weekly</span>
                <div className={styles.footerLinks}>
                    <a href="/feed.xml">RSS</a>
                    <a href="https://github.com/Skanislav/skas.me" target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
            </footer>
        </main>
    )
}
