import React from 'react';

interface SelectButtonSpec<T> {
	name?: string,
	setValue: (v: T) => void,
	value: T,
	list: T[],
	direction: 'left' | 'right'
}

export default function SelectButton<T>(props: SelectButtonSpec<T>): JSX.Element {
	const getNextValue = () => {
		if (props.list.indexOf(props.value) === props.list.length - 1)
			return props.list[0];
		return props.list[props.list.indexOf(props.value) + 1]
	}

	const getPreviousValue = () => {
		if (props.list.indexOf(props.value) === 0)
			return props.list[props.list.length - 1];
		return props.list[props.list.indexOf(props.value) - 1]
	}

	const onClick = () => {
		if (props.direction === 'left') {
			sendPreviousValue();
		} else {
			sendNextValue();
		}
	}

	const sendNextValue = (): void => {
		props.setValue(getNextValue());
	}

	const sendPreviousValue = (): void => {
		props.setValue(getPreviousValue());
	}

	const arrowStyle = props.direction === 'left' ? 'icon icon-arrow-left w-8 fill-current text-white-white' : 'transform rotate-180 icon icon-arrow-left w-8 fill-current text-white-white';

	return (
		<div className="flex flex-col items-center">
			<p className="text-md text-white-white">{props.name}</p>
			<button
				onClick={onClick}
				className="bg-blue-200 hover:bg-yellow-dark-yellow text-gray-800 font-bold py-1 px-1 rounded-full inline-flex items-center transition duration-300"
			>
				<svg viewBox="0 0 32 32"
					className={arrowStyle}
					aria-hidden="true"
				>
					<path d="M26.025 14.496l-14.286-.001 6.366-6.366L15.979 6 5.975 16.003 15.971 26l2.129-2.129-6.367-6.366h14.29z" />
				</svg>

			</button>
		</div>
	);
}
