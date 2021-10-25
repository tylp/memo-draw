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
			<div className="overflow-x-auto">
				<div className="flex flex-row items-center">
					{
						props.children
					}
				</div>
			</div>
			<FontAwesomeIcon className="text-white-white opacity-25" size="4x" icon={faChevronRight} />
		</>
	)
}
