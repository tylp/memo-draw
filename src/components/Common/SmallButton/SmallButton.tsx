import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { SmallButtonSpec } from "./SmallButton.spec";


export default function SmallButton(props: SmallButtonSpec) : JSX.Element {

    const [className, setClassName] = useState('');

    useEffect(() => {
        setClassName(`
                        rounded-md pl-3 pr-3 h-8
                        transition duration-300
                        font-rubik-bold uppercase
                        ${props.disabled ? `${props.bgColor} text-white-white cursor-default` : `${props.bgColor} ${props.color} hover:${props.bgColor}`}
                        ${props.className}
                    `);
    }, [props.disabled, props.className, props.bgColor, props.color])

    return(
        <button
        onClick={props.onClick}
        disabled={props.disabled || false}
        className={className}
        type={props.type}
        >
			{props.icon ? <FontAwesomeIcon icon={props.icon}/> : ''} {props.children}
        </button>
    )

}
