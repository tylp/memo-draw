import React, { ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Size } from '../../../../server/types/Size';
import { Color } from '../../../../server/types/Color';

interface ButtonSpec {
	children: ReactNode,
	className?: string,
	onClick?: React.MouseEventHandler<HTMLButtonElement>,
	disabled?: boolean,
	size: Size,
	color: Color,
	icon?: IconDefinition
}

export default function Button(props: ButtonSpec): JSX.Element {

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
			else if (props.color === 'light-secondary') {
				color = 'bg-grey-light-grey hover:bg-blue-blue text-yellow-light-yellow';
			}
		}

		setClassName(`
						rounded-md
						whitespace-nowrap
						${props.className}
						${props.size === 'small' ? 'pl-4 pr-3 m-1 mr-1 h-8' : null}
						${props.size === 'medium' ? 'pl-4 pr-4 pt-1 ml-1 mr-1 pb-1' : null}
						${props.size === 'large' ? 'w-1/2 pt-4 pb-4 ml-1 mr-1' : null}
						transition duration-300
						font-rubik-bold uppercase
						${color}
					`);
	}, [props.disabled, props.className, props.size, props.color])

	return (
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
