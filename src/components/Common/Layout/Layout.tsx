import React, { ReactNode } from 'react';
import Logo from '../Logo/Logo';

interface LayoutSpec {
	children: ReactNode
}

export default function Layout({ children }: LayoutSpec): JSX.Element {
	return (
		<div className='
			min-w-screen
			min-h-screen
			bg-gradient-to-r
			from-blue-blue to-blue-light-blue
		'>
			<div className='
				flex
				flex-col
				justify-center
				items-center
			'>
				<div className='py-2'>
					<Logo size='small' />
				</div>
				<div className='
					px-32
					py-4
					border-8
					border-white-white
					border-opacity-10
					rounded-xl
					w-3/5
				'>
					{children}
				</div>
			</div>
		</div>

	)
}