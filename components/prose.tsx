import React from 'react'
import styles from './prose.module.css'

// Periwinkle "NOTE" callout from the design's reading view.
export function Callout({label = 'NOTE', children}: React.PropsWithChildren<{label?: string}>) {
    return (
        <div className={styles.callout}>
            <div className={styles.calloutLabel}>{label}</div>
            <p className={styles.calloutBody}>{children}</p>
        </div>
    )
}

// Pull-quote with an optional monospace citation line.
export function Quote({cite, children}: React.PropsWithChildren<{cite?: string}>) {
    return (
        <blockquote className={styles.blockquote}>
            <p>{children}</p>
            {cite && <div className={styles.cite}>{cite}</div>}
        </blockquote>
    )
}

// Figure that renders a hatched placeholder when no `src` is given (matching the
// design's image placeholders), or a real image when one is provided.
export function Figure({src, alt, label, caption}: {src?: string; alt?: string; label?: string; caption?: string}) {
    return (
        <figure className={styles.figure}>
            {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.figureImg} src={src} alt={alt ?? caption ?? ''}/>
            ) : (
                <div className={styles.figureBox}>
                    <span className={styles.figureLabel}>[ {label ?? alt ?? 'image'} ]</span>
                </div>
            )}
            {caption && <figcaption className={styles.figcaption}>{caption}</figcaption>}
        </figure>
    )
}
