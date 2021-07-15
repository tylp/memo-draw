import React from "react";
import { IButton } from "./Button.spec";

export default function Button(props: IButton) : JSX.Element {

    return(
        <button 
        onClick={props.onClick}
        className={`
            rounded-sm pl-2 pt-1 pr-2 pb-1
            bg-pink-dark-pink text-white-white
            hover:bg-pink-light-pink 
            transition duration-300
            font-bold uppercase
            ${props.className}
        `}
        >
            {props.children}
        </button>
    )

}