import React from 'react';
import { TitleSpec } from './Title.spec';

export default function Title({children}: TitleSpec) : JSX.Element {

	return(
		<div className="flex space-x-2 mt-2 mb-2">
			<svg version="1.1" className="w-4 fill-current text-yellow-light-yellow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 552.611 552.611"
			>
				<g>
					<path d="M486.413,221.412L122.347,12.916c-52.938-30.318-95.852-5.44-95.852,55.563v415.652c0,61.004,42.914,85.882,95.852,55.563
					l364.066-208.49C539.351,300.887,539.351,251.731,486.413,221.412z"/>
				</g>
			</svg>
			<h1 className="text-white-white font-bold leading-3">
				{children}
			</h1>
		</div>
		
	);
}