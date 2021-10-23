import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode } from 'react';

interface ButtonSpec {
	children: ReactNode,
}

export default function Carousel(props: ButtonSpec): JSX.Element {
	return (
		<>
			<FontAwesomeIcon className="text-white-white opacity-25" size="4x" icon={faChevronLeft} />
			<div className="w-full flex flex-row items-center overflow-hidden">
				{
					props.children
				}
			</div>
			<FontAwesomeIcon className="text-white-white opacity-25" size="4x" icon={faChevronRight} />
		</>
	)
}
