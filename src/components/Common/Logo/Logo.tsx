import React, { useEffect, useState } from 'react';

type Size = 'small' | 'medium' | 'large' | 'auto';

interface LogoProps {
	size?: Size
}

Logo.defaultProps = {
	size: 'auto'
}

export default function Logo(props: LogoProps): JSX.Element {
	const getSize = (size: Size): string => {
		switch (size) {
			case 'small':
				return 'w-40 h-22';
			case 'medium':
				return 'w-60 h-36';
			case 'large':
				return 'w-80 h-44';
			default:
				return '';
		}
	}

	const [className, setClassName] = useState(getSize(props.size));

	useEffect(() => {
		setClassName(getSize(props.size))
	}, [props.size])

	return (
		<img
			src='/img/logo.svg'
			className={className}
		/>
	)
}
