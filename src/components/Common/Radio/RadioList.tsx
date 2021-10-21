import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IRadioNode } from '../../../../server/interfaces/IRadioNode';

interface RadioSpec {
	className?: string,
	name: string,
	list: IRadioNode[],
	size: 'small' | 'medium' | 'big',
	color: 'primary' | 'secondary' | 'light-secondary',
	setCurrentValue: Dispatch<SetStateAction<string | number>>,
	currentValue: string | number,
}

export default function RadioList(props: RadioSpec): JSX.Element {

	const [className, setClassName] = useState('');

	useEffect(() => {
		let color = '';

		if (props.color === 'light-secondary') {
			color = 'bg-grey-light-grey hover:bg-blue-blue text-white-white';
		}

		setClassName(`
			${props.className}
			${color}
			${props.size === 'big' ? 'pt-5 pb-5 pl-4 pr-4 ml-1 mr-1 mt-4' : null}
			text-center
			w-32
			rounded-md
			transition duration-300
			font-rubik-bold
			capitalize
			ring-yellow-light-yellow
		`);

	}, [props.size, props.color, props.currentValue, props.className])

	return (
		<>
			{
				props.list.map(element => <button key={element.value} className={className + (props.currentValue === element.value ? ' ring-2' : null)} onClick={() => props.setCurrentValue(element.value)}>{element.content}</button>)
			}
		</>
	)
}