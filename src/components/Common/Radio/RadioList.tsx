import React, { useEffect, useState } from "react";

interface RadioSpec {
	className?: string,
	name: string,
	list: any,
	size: 'small' | 'medium' | 'big',
	color: 'primary' | 'secondary' | 'light-secondary',
}

export default function RadioList(props: RadioSpec): JSX.Element {

	const [currentSelection, setCurrentSelection] = useState('');

	const [labelClassName, setLabelClassName] = useState('');

	useEffect(() => {
		let color = '';

		if (props.color === 'light-secondary') {
			color = 'bg-grey-light-grey hover:bg-blue-blue text-white-white';
		}
		
		setLabelClassName(`
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
			focus:ring-2
		`);

	}, [props.size, props.color])

	console.log(props.list)

	return (
		<>
			{
				props.list.map(element => <button className={labelClassName}>{element}</button>)
			}	
			{/* <button className={labelClassName}>Slow</button>
			<button className={labelClassName}>Normal</button>
			<button className={labelClassName}>Fast</button> */}
		</>
	)
}