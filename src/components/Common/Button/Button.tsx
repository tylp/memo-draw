import React, { useEffect, useState } from 'react';
import { IButton } from "./Button.spec";


export default function Button(props: IButton) : JSX.Element {

    const [className, setClassName] = useState('');

    useEffect(() => {
        setClassName(`
                        rounded-sm pl-2 pt-1 pr-2 pb-1
                        transition duration-300
                        font-bold uppercase
                        ${props.disabled ? `bg-pink-light-pink text-white-white cursor-default` : `bg-pink-dark-pink text-white-white hover:bg-pink-light-pink`}
                        ${props.className}
                    `);
    }, [props.disabled, props.className])

    return(
        <button
        onClick={props.onClick}
        disabled={props.disabled || false}
        className={className}
        type={props.type}
        >
            {props.children}
        </button>
    )

}
