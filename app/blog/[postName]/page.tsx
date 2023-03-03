import {lazy, Suspense} from "react";
import styles from '../../page.module.css'
import {Navigation} from "@/components";

export default function BlogPost({params}: { params: { postName: string } }) {
    const MarkdownPreview = lazy(() => import('../../../posts/' + params.postName + '.mdx'));

    return (
        <article className={styles.main}>
            <Suspense fallback={<>Loading...</>}>
                <MarkdownPreview/>
            </Suspense>

            <Navigation links={[{title: 'back to blog', href: '/blog'}]}/>
        </article>
    )
}