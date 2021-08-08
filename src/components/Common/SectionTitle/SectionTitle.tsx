import React from "react";
import { SectionTitleSpec } from "./SectionTitle.spec";

export default function SectionTitle({children, subtitle, hintColor}: SectionTitleSpec) : JSX.Element {

	return(
		<div className="flex flex-col mt-2 mb-6 relative uppercase">
			{subtitle ?
				<div className="z-10 absolute -top-3 -left-14 p-0.5 pl-2 pr-2 rounded-lg transform -rotate-45 bg-pink-dark-pink font-bold text-white-white">{subtitle}</div>
			: ''}
			<div className="z-0 text-2xl text-white-white font-bold leading-8">
				{children}
			</div>
			<svg version="1.1" className={"w-10 fill-current " + hintColor} xmlns="http://www.w3.org/2000/svg" width="49" height="8" viewBox="0 0 49 8"fill="none"
			>
				<g>
					<rect width="49" height="8" rx="4"/>
				</g>
			</svg>
		</div>
	);
}