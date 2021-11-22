import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import StyleBuilder from '../../../../server/classes/StyleBuilder';
import { IRadioNode } from '../../../../server/interfaces/IRadioNode';
import { Color } from '../../../../server/types/Color';
import { Size } from '../../../../server/types/Size';

interface RadioSpec {
	list: IRadioNode[],
	size: Size,
	color: Color,
	setCurrentValue: Dispatch<SetStateAction<string | number>>,
	currentValue: string | number,
}

export default function RadioList(props: RadioSpec): JSX.Element {

	const [className, setClassName] = useState('');

	useEffect(() => {

		setClassName(`
			${(new StyleBuilder(props.color, props.size)).buildColor().buildSize().getResult()}
			text-center
			w-32
			rounded-md
			transition duration-300
			font-rubik-bold
			capitalize
			ring-yellow-light-yellow
		`);

	}, [props.size, props.color, props.currentValue])

	return (
		<>
			{
				props.list.map(element => <button key={element.value} className={className + (props.currentValue === element.value ? ' ring-2' : null)} onClick={() => props.setCurrentValue(element.value)}>{element.content}</button>)
			}
		</>
	)
}