import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonSpec } from './Button.spec';


export default function Button(props: ButtonSpec) : JSX.Element {

	const [className, setClassName] = useState('');

	useEffect(() => {
		setClassName(`
						rounded-md
						${props.size === 'small' ? 'pl-3 pr-3 h-8' : ''}
						${props.size === 'normal' ? 'pl-2 pt-1 pr-2 pb-1' : ''}
						transition duration-300
						font-rubik-bold uppercase
						${props.disabled ? `${props.bgColor} text-white-white cursor-default` : `${props.bgColor} ${props.color} hover:${props.bgColorHover}`}
						${props.className}
					`);
	}, [props.disabled, props.className, props.bgColor, props.bgColorHover, props.size, props.color])

	return(
		<button
			onClick={props.onClick}
			disabled={props.disabled || false}
			className={className}
			type={props.type}
		>
			<span className='pr-1'>{props.icon ? <FontAwesomeIcon icon={props.icon} /> : ''}</span>
			{props.children}
		</button>
	)

}
