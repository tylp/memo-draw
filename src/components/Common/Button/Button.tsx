import React, { ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Size } from '../../../../server/types/Size';
import { Color } from '../../../../server/types/Color';
import ButtonStyleBuilder from './ButtonStyleBuilder';

interface ButtonSpec {
	children: ReactNode,
	onClick?: React.MouseEventHandler<HTMLButtonElement>,
	disabled?: boolean,
	fullHeight?: boolean,
	fullWidth?: boolean,
	selected?: boolean,
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
			${props.fullWidth ? 'w-full' : ''}
			${props.fullHeight ? 'h-full' : ''}
			${(new ButtonStyleBuilder(props.disabled ? 'disabled' : props.color, props.size)).setIsSelected(!!props.selected).buildColor().buildSize().buildHover().getResult()}
			transition duration-300
			font-rubik-bold uppercase
		`);
	}, [props.disabled, props.size, props.color, props.fullWidth, props.fullHeight, props.selected])

	return (
		<button
			onClick={props.onClick}
			disabled={props.disabled || false}
			className={className}
		>
			{props.icon ? <span className="pr-1"><FontAwesomeIcon icon={props.icon} /></span> : null}
			{props.children}
		</button>
	)

}
