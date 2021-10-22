import React, { ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Size } from '../../../../server/types/Size';
import { Color } from '../../../../server/types/Color';
import StylingBuilder from '../../../../server/classes/stylingBuilder';

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
		setClassName(`
						rounded-md
						whitespace-nowrap
						${props.className}
						${(new StylingBuilder(props.disabled ? 'disabled' : props.color, props.size)).buildColor().buildSize().getResult()}
						transition duration-300
						font-rubik-bold uppercase
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
