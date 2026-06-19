import Link from 'next/link'
import styles from './site-header.module.css'
import {EthMark} from './eth-mark'

// Masthead shared across the blog index and reading view. "About" is an inert
// span by design (out of scope in the source); only the wordmark and "Notes"
// route home.
export function SiteHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link href="/epf" className={styles.brand} aria-label="Fellowship Notes — home">
                    <EthMark className={styles.brandMark}/>
                    <span className={styles.wordmark}>FELLOWSHIP NOTES</span>
                </Link>
                <nav className={styles.nav}>
                    <Link href="/epf" className={styles.navActive}>Notes</Link>
                    <span className={styles.navInert}>About</span>
                </nav>
            </div>
        </header>
    )
}
