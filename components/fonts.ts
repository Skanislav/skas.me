import {Newsreader, Space_Mono} from 'next/font/google'

// Serif reading column — matches the design's Newsreader usage.
export const newsreader = Newsreader({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    weight: ['400', '500', '600'],
    display: 'swap',
    variable: '--font-newsreader',
})

// Monospace wordmark / metadata labels.
export const spaceMono = Space_Mono({
    subsets: ['latin'],
    weight: ['400', '700'],
    display: 'swap',
    variable: '--font-space-mono',
})
