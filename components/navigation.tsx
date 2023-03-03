import Link from "next/link";
import styles from './navigation.module.css'

type NavigationProps = {
    links: {
        href: string
        title: string
    }[]
}

export function Navigation({ links }: NavigationProps) {
    return (
        <nav>
            <ul className={styles.nav}>
                {links.map((link) => (
                    <li key={link.title}>
                        <Link href={link.href}>{link.title}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}