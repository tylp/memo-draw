import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import Logo from '../Logo/Logo';
import Box from '../Box/Box';

interface WhiteBorderProps {
	children: ReactNode;
}

function useDebounce(callback, delay) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedFn = useCallback(
		debounce((...args) => callback(...args), delay),
		[delay],
	);
	return debouncedFn;
}

function getCurrentWindowDimensions(): {width: number; height: number} {
	const {innerWidth: width, innerHeight: height} = window;
	return {width, height}
}

function WhiteBorder(props: WhiteBorderProps): JSX.Element {
	return (
		<div className='relative  w-full border-l-8 border-b-8 border-r-8 border-white-white border-opacity-10 rounded-xl'>
			<div className='absolute border-t-8 border-white-white border-opacity-10'
				style={{
					borderTopLeftRadius: '9999px',
					left: '0em',
					width: '30em',
				}}>
			</div>
			<div className='absolute border-t-8 border-white-white border-opacity-10'
				style={{
					borderTopRightRadius: '9999px',
					right: '0em',
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
	const MAX_RATIO = 1;
	const MAX_WIDTH = 1920;

	const firstWindowDimensions = getCurrentWindowDimensions();
	const [dimensionRatio, setDimensionRatio] = useState(getCurrentWindowDimensions().width / MAX_WIDTH);

	const debounceResizeWithRatio = useDebounce((nextRatio) => setDimensionRatio(nextRatio), 100);

	function handleResize() {
		let nextRatio = getCurrentWindowDimensions().width / firstWindowDimensions.width;
		if (nextRatio > MAX_RATIO)
			nextRatio = MAX_RATIO
		debounceResizeWithRatio(nextRatio)
	}

	useEffect(() => {
		window.addEventListener('resize', handleResize);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="sm:hidden flex flex-col justify-center items-center font-rubik-bold text-lg text-white-white">
				<p>Working on a mobile version</p>
			</div>
			<div className="flex flex-col justify-center items-center w-screen h-screen min-h-screen min-w-full">
				<div className=""
					style={{
						transform: `scale(${dimensionRatio})`,
					}}>

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