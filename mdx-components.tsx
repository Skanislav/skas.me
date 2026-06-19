import type {MDXComponents} from 'mdx/types'
import React from "react";

import prose from './components/prose.module.css'
import {Callout, Figure, Quote} from './components/prose'

function H1({children}: React.PropsWithChildren) {
    return <h1 className={prose.h}>{children}</h1>
}

function H2({children}: React.PropsWithChildren) {
    return <h2 className={prose.h}>{children}</h2>
}

function P({children}: React.PropsWithChildren) {
    return <p className={prose.p}>{children}</p>
}

function Ul({children}: React.PropsWithChildren) {
    return <ul className={prose.list}>{children}</ul>
}

function Li({children}: React.PropsWithChildren) {
    return <li className={prose.li}>{children}</li>
}

function Blockquote({children}: React.PropsWithChildren) {
    return <blockquote className={prose.blockquote}>{children}</blockquote>
}

function A({href, children}: React.PropsWithChildren<{href?: string}>) {
    return <a href={href} className={prose.link}>{children}</a>
}

// Fenced code blocks arrive as <pre><code class="language-xxx">…</code></pre>.
// Wrap them in the design's framed container and surface the language label.
function Pre({children}: {children?: React.ReactNode}) {
    const code = children as React.ReactElement<{className?: string}> | undefined
    const className = code?.props?.className ?? ''
    const match = /language-(\w+)/.exec(className)
    const lang = match?.[1]

    return (
        <div className={prose.codeWrap}>
            <div className={prose.codeHead}>
                <span className={prose.codeLang}>{lang ?? 'text'}</span>
            </div>
            <pre className={prose.pre}>{children}</pre>
        </div>
    )
}

// Inline code only — code inside <pre> inherits via the .pre code rule.
function Code({className, children}: React.PropsWithChildren<{className?: string}>) {
    if (className) {
        return <code className={className}>{children}</code>
    }
    return <code className={prose.inlineCode}>{children}</code>
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        h1: H1,
        h2: H2,
        p: P,
        ul: Ul,
        li: Li,
        blockquote: Blockquote,
        a: A,
        pre: Pre,
        code: Code,
        // Available to every post without an explicit import.
        Callout,
        Figure,
        Quote,
    };
}
