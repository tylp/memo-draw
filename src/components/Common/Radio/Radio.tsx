import React, { useEffect, useState } from "react";

interface RadioSpec {
	className?: string,
	size: 'small' | 'medium' | 'big',
	color: 'primary' | 'secondary' | 'light-secondary',
}

export default function Radio(props: RadioSpec): JSX.Element {

	const [inputClassName, setInputClassName] = useState('');
	const [labelClassName, setLabelClassName] = useState('');

	useEffect(() => {
		let color = '';

		setInputClassName(`
			opacity-0 w-0 fixed
		`);

		if (props.color === 'light-secondary') {
			color = 'bg-grey-light-grey hover:bg-blue-blue text-yellow-light-yellow focus:bg-pink-light-pink';
		}
		
		setLabelClassName(`
			${props.className}
			${color}
			${props.size === 'big' ? 'w-1/2 pt-4 pb-4 ml-1 mr-1 mt-4 mb-4' : null}
			rounded-md
			transition duration-300
			font-rubik-bold uppercase
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