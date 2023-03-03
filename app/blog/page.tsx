import fs from 'fs';
import path from 'path';

import styles from '../page.module.css';
import {Navigation} from "@/components/navigation";

export const metadata = {
    title: 'Skas\' Blog',
    description: 'Here is my Blog powered by interesting conversations with ChatGPT and more.'
}

const blogNavigation = [
    {
        href: '/',
        title: 'mainframe'
    }
]

async function getPosts() {
    const postsDirectory = path.join(process.cwd(), 'posts');
    return fs.readdirSync(postsDirectory);
}

function getPostLink(name: string) {
    return name.replace(/.mdx/g, '');
}

function getPostsNavigation(postName: string) {
   return {
       title: postName,
       href: `/blog/${getPostLink(postName)}`
   }
}

export default async function BlogPage() {
    const postFileNames = await getPosts();

    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <h1>Skas&apos; ChatGPT3 Powered Blog ✨</h1>
                <p>
                    Here is my Blog powered by interesting conversations with ChatGPT and more.
                </p>
            </div>

            <Navigation links={postFileNames.map(getPostsNavigation)}/>

            <Navigation links={blogNavigation}/>
        </main>
    )
}