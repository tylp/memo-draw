import React, { useEffect, useState } from "react";
import { RadioSpec } from "./Radio.spec";

export default function Radio(props: RadioSpec): JSX.Element {

    const [className, setClassName] = useState('');

    useEffect(() => {
        let color = '';

		if (props.color === 'primary') {
			color = 'bg-pink-dark-pink hover:bg-pink-light-pink text-white-white';
		}
		else if (props.color === 'secondary') {
			color = 'bg-blue-darker-blue hover:bg-blue-blue text-yellow-light-yellow';
		}
		else if (props.color === 'light-secondary') {
			color = 'bg-grey-light-grey hover:bg-blue-blue text-yellow-light-yellow';
		}

        setClassName(`
            rounded-md
            ${props.className}
            ${props.size === 'small' ? 'pl-4 pr-3 m-1 mr-1 h-8' : null}
            ${props.size === 'medium' ? 'pl-4 pr-4 pt-1 ml-1 mr-1 pb-1' : null}
            ${props.size === 'big' ? 'w-1/2 pt-4 pb-4 ml-1 mr-1' : null}
            transition duration-300
            font-rubik-bold uppercase
            ${color}
        `);

    }, [props.size, props.color])

    return (
        <>
            <div className={className}>
                <input type="radio" className="hidden" id="slow" name="drone" value="huey" checked />
                <label htmlFor="slow">Slow</label>
            </div>

            <div className={className}>
                <input type="radio" id="normal" name="drone" value="dewey" />
                <label htmlFor="normal">Normal</label>
            </div>

            <div className={className}>
                <input type="radio" id="fast" name="drone" value="louie" />
                <label htmlFor="fast">Fast</label>
            </div>
        </>
    )
}