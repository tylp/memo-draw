import React, { ReactNode } from 'react';
import Logo from '../Logo/Logo';
import Box from '../Box/Box';

interface WhiteBorderProps {
	children: ReactNode;
}

function WhiteBorder(props: WhiteBorderProps): JSX.Element {
	return (
		<div className='relative w-full border-l-8 border-b-8 border-r-8 border-white-white border-opacity-10 rounded-xl'>
			<div className='absolute border-t-8 left-0 border-white-white border-opacity-10'
				style={{
					borderTopLeftRadius: '9999px',
					width: '30em',
				}}>
			</div>
			<div className='absolute border-t-8 right-0 border-white-white border-opacity-10'
				style={{
					borderTopRightRadius: '9999px',
					width: '30em',
				}}>
			</div>
			<div className="relative">
				{props.children}
			</div>
		</div>
	)
}

interface LayoutSpec {
	children: ReactNode
}


export default function Layout({ children }: LayoutSpec): JSX.Element {

	return (
		<>
			<div className="sm:hidden flex flex-col justify-center items-center font-rubik-bold text-lg text-white-white">
				<p>Working on a mobile version</p>
			</div>
			<div className="flex flex-col justify-center items-center w-screen h-screen min-h-screen min-w-full">
				<div>
					<Box py={4}>
						<div className='relative'
							style={{
								width: '80rem',
							}}>
							<WhiteBorder>
								<div className='flex flex-col items-center'>
									<Box py={2} className="absolute -top-16 flex flex-col justify-center items-center">
										<Logo size='medium' />
									</Box>
								</div>
								<div>
									<Box pt={24} pb={8} pl={8} pr={8}>
										{children}
									</Box>
								</div>
							</WhiteBorder>
						</div>
					</Box>
				</div>
			</div>
		</>
	)
}