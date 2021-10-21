import React, { useEffect, useState } from "react";
import { RadioSpec } from "./Radio.spec";

export default function Radio(props: RadioSpec): JSX.Element {

    const [inputClassName, setInputClassName] = useState('');
    const [labelClassName, setLabelClassName] = useState('');

    useEffect(() => {
        let color = '';

		if (props.color === 'light-secondary') {
			color = 'bg-grey-light-grey hover:bg-blue-blue text-yellow-light-yellow focus:bg-pink-light-pink';
		}

        setInputClassName(`
            rounded-md
            opacity-0 w-0 fixed
            ${props.className}
            ${props.size === 'big' ? 'w-1/2 pt-4 pb-4 ml-1 mr-1' : null}
            transition duration-300
            font-rubik-bold uppercase
            ${color}
        `);

    }, [props.size, props.color])

    return (
        <>
            <div >
                <input type="radio" className={inputClassName} name="speed" value="slow" checked />
                <label htmlFor="slow" className={labelClassName}>Slow</label>
            </div>

            <div>
                <input type="radio" className={inputClassName} name="speed" value="normal" />
                <label htmlFor="normal" className={labelClassName}>Normal</label>
            </div>

            <div>
                <input type="radio" className={inputClassName} name="speed" value="fast" />
                <label htmlFor="fast" className={labelClassName}>Fast</label>
            </div>
        </>
    )
}