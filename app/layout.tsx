import {Inter} from "next/font/google";
import React from "react";

import './globals.css'

export const metadata = {
    title: 'Skas.me',
    description: 'Nothing to see here, move along.'
}

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
})


export default function RootLayout(
    {
        children,
    }: React.PropsWithChildren
) {
    return (
        <html lang="en">
        <body className={`${inter.className}`}>
        {children}
        </body>
        </html>
    )
}
