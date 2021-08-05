import React, { ReactNode } from "react";

interface LayoutSpec {
    children: ReactNode
}

export default function Layout({ children }: LayoutSpec) : JSX.Element {
    return(
        <div className="
            w-screen
            h-screen
            bg-gradient-to-r
            from-blue-blue to-blue-light-blue
            flex
            justify-center
            items-center
        ">
            <div className="">
				{/* <Rectangle/> */}
                {children}
            </div>
        </div>
    )
}