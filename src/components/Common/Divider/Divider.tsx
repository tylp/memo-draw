import React, { useEffect, useState } from 'react';
import { DividerSpec } from './Divider.spec';


export default function Divider(props: DividerSpec): JSX.Element {

	const [className, setClassName] = useState('');

	useEffect(() => {
		setClassName(`w-full ml-12 mr-12 self-center border-t-4 border-opacity-25 border-white-white rounded-md ${props.className}`);
	}, [props.className])

	return (
		<div className={className} />
	)

}
