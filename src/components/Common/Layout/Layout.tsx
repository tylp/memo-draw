import React, { ReactNode } from "react";
import Logo from "../Logo/Logo";

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
        ">
            <div className="
                flex
                flex-col
                justify-center
                items-center
            ">
                <Logo/>
                <div className="
                    px-32
                    py-16
                    border-8
                    border-white-white
                    border-opacity-10
                    rounded-xl
                ">
                    {children}
                </div>
            </div>
        </div>
        
    )
}