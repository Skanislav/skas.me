import React from 'react'

// Monochrome Ethereum diamond — the single subtle ETH nod in the minimal design.
// Colour comes from the surrounding `color` via currentColor.
export function EthMark({width = 12, height = 20, className}: {width?: number; height?: number; className?: string}) {
    return (
        <svg
            viewBox="0 0 256 417"
            width={width}
            height={height}
            className={className}
            style={{display: 'block'}}
            aria-hidden="true"
        >
            <path fill="currentColor" opacity="0.85" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
            <path fill="currentColor" opacity="0.5" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
            <path fill="currentColor" opacity="0.85" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
            <path fill="currentColor" opacity="0.5" d="M127.962 416.905v-104.72L0 236.585z"/>
            <path fill="currentColor" opacity="1" d="M127.961 287.958l127.96-75.637-127.96-58.162z"/>
            <path fill="currentColor" opacity="0.65" d="M0 212.321l127.96 75.637V154.159z"/>
        </svg>
    )
}
