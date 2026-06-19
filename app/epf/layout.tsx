import React from "react";

import {newsreader, spaceMono} from "@/components/fonts";
import {SiteHeader} from "@/components/site-header";
import styles from "./epf.module.css";

export default function BlogLayout({children}: React.PropsWithChildren) {
    return (
        <div className={`${newsreader.variable} ${spaceMono.variable} ${styles.shell}`}>
            <SiteHeader/>
            {children}
        </div>
    )
}
