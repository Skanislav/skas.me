import styles from './page.module.css'
import {Navigation} from "@/components/navigation";

const mainNavigation = [
    {
        href: '/blog',
        title: 'blog'
    }
]

export default function Home() {
    return (
        <>
            <main className={styles.main}>
                <h1>Skas&apos; Mainframe</h1>

                <Navigation links={mainNavigation}/>
            </main>
        </>
    )
}
