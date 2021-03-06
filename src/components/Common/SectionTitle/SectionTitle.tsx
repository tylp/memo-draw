import React, { ReactNode } from 'react';

interface SectionTitleSpec {
	children: ReactNode;
	subtitle?: string;
	hintColor?: string;
}
export default function SectionTitle(props: SectionTitleSpec): JSX.Element {

	return (
		<div className="flex flex-col relative uppercase">
			{
				props.subtitle && (
					<div className="z-10 absolute -top-4 -left-14 p-0.5 pl-2 pr-2 rounded-lg transform -rotate-12 bg-pink-dark-pink font-bold text-white-white">
						{props.subtitle}
					</div>
				)
			}
			<div className="z-0 text-3xl text-white-white font-bold leading-8 font-rubik-black fix-stroke outline-title">
				{props.children}
			</div>
			<svg
				version="1.1"
				className={`w-10 fill-current ${props.hintColor}`}
				xmlns="http://www.w3.org/2000/svg"
				width="49" height="8"
				viewBox="0 0 49 8"
				fill="none"
			>
				<g>
					<rect width="49" height="8" rx="4" />
				</g>
			</svg>
		</div>
	);
}