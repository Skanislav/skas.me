import styles from './app/blog/blog.module.css'
import React from "react";

function H1({ children }: React.PropsWithChildren) {
    return <h1>
        {children}
    </h1>
    // ...
}

function P({ children }: React.PropsWithChildren) {
    return <p className={styles.description}>
        {children}
    </p>
    // ...
}

export function useMDXComponents(components: Record<string, React.ComponentType>) {
    return { h1: H1, ...components, p: P };
}