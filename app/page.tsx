import Link from 'next/link'

import {newsreader, spaceMono} from '@/components/fonts'
import {EthMark} from '@/components/eth-mark'
import styles from './page.module.css'

export const metadata = {
    title: 'skas',
    description: 'Building on Ethereum.',
}

export default function Home() {
    return (
        <main className={`${newsreader.variable} ${spaceMono.variable} ${styles.main}`}>
            <div className={styles.card}>
                <EthMark width={18} height={30} className={styles.mark}/>
                <h1 className={styles.name}>skas</h1>
                <p className={styles.tagline}>building on ethereum</p>
                <Link href="/epf" className={styles.link}>&rarr; EPF Fellowship Notes</Link>
            </div>
        </main>
    )
}
