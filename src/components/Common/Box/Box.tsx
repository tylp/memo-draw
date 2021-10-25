import React, { ReactNode, useEffect, useState } from 'react';

interface Padding {
	p?: number;
	pt?: number;
	pr?: number;
	pb?: number;
	pl?: number;
	px?: number;
	py?: number;
}

interface Margin {
	m?: number;
	mt?: number;
	mr?: number;
	mb?: number;
	ml?: number;
	mx?: number;
	my?: number;
}

interface BoxProps extends Padding, Margin {
	children?: ReactNode;
	className?: string;
}

export default function Box(props: BoxProps): JSX.Element {
	const [className, setClassName] = useState('');

	useEffect(() => {
		const getClassName = (): string => {
			let buffer = '';
			const getBufferedMap = (letter: string): string => [
				letter,
				letter + 't',
				letter + 'r',
				letter + 'b',
				letter + 'l',
				letter + 'x',
				letter + 'y',
			].map(e => props[e] ? `${e}-${props[e]}` : '').join(' ');
			buffer += getBufferedMap('m') + ' ' + getBufferedMap('p') + ' ';
			buffer += props.className || '';
			return buffer;
		}

		setClassName(getClassName());
	}, [props])

	return (
		<div className={className}>
			{props.children}
		</div>
	)
}
