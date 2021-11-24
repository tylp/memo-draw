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
		<div className='w-full border-l-8 border-b-8 border-r-8 border-white-white border-opacity-10 rounded-b-xl'>
			<div className='absolute border-t-8 border-white-white border-opacity-10'
				style={{
					left: '0.48em',
					width: '30em',
				}}>
			</div>
			<div className='absolute border-t-8 border-white-white border-opacity-10'
				style={{
					right: '0.48em',
					width: '30em',
				}}>
			</div>
			<div className="relative -top-16">
				{props.children}
			</div>
		</div>
	)
}

interface LayoutSpec {
	children: ReactNode
}


export default function Layout({ children }: LayoutSpec): JSX.Element {
	const MAX_RATIO = 0.95;

	const firstWindowDimensions = getCurrentWindowDimensions();
	const [dimensionRatio, setDimensionRatio] = useState(MAX_RATIO);

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
						<div className='flex flex-col'
							style={{
								width: '80rem',
							}}>
							<WhiteBorder>
								<Box py={2} className="relative flex flex-col justify-center items-center">
									<Logo size='medium' />
								</Box>
								<Box p={2}>
									{children}
								</Box>
							</WhiteBorder>
						</div>
					</Box>
				</div>
			</div>
		</>
	)
}