import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonSpec } from './Button.spec';

export default function Button(props: ButtonSpec) : JSX.Element {

	const [className, setClassName] = useState('');

	useEffect(() => {

		let color = '';

		if (props.disabled) {
			color = 'bg-grey-grey text-white-white cursor-default';
		} else {
			if (props.color === 'primary') {
				color = 'bg-pink-dark-pink hover:bg-pink-light-pink text-white-white';
			}
			else if (props.color === 'secondary') {
				color = 'bg-blue-darker-blue hover:bg-blue-blue text-yellow-light-yellow';
			}
		}

		setClassName(`
						rounded-md
						${props.className}
						${props.size === 'small' ? 'pl-3 pr-3 h-8' : null}
						${props.size === 'medium' ? 'pl-2 pt-1 pr-2 pb-1' : null}
						transition duration-300
						font-rubik-bold uppercase
						${color}
					`);
	}, [props.disabled, props.className, props.size, props.color])

	return(
		<button
			onClick={props.onClick}
			disabled={props.disabled || false}
			className={className}
		>
			{props.icon ? <span className='pr-1'><FontAwesomeIcon icon={props.icon} /></span> : null}
			{props.children}
		</button>
	)

}
