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
		<div className='w-full border-8 border-white-white border-opacity-10 rounded-xl'>
			{props.children}
		</div>
	)
}

interface LayoutSpec {
	children: ReactNode
}


export default function Layout({ children }: LayoutSpec): JSX.Element {
	const MAX_RATIO = 1;

	const firstWindowDimensions = getCurrentWindowDimensions();
	const [dimensionRatio, setDimensionRatio] = useState(1);

	const debounceResizeWithRatio = useDebounce((nextRatio) => setDimensionRatio(nextRatio), 100);

	function handleResize() {
		let nextRatio = getCurrentWindowDimensions().width/firstWindowDimensions.width;
		if (nextRatio > MAX_RATIO)
			nextRatio = MAX_RATIO
		debounceResizeWithRatio(nextRatio)
	}

	useEffect(() => {
		window.addEventListener('resize', handleResize);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex flex-col items-center w-screen h-screen min-h-screen min-w-full">
			<div className="sm:hidden">
				yes
			</div>
			<div className=""
				style={{
					transform: `scale(${dimensionRatio})`,
				}}>
				<Box py={2} className="flex flex-col justify-center items-center">
					<Logo size='small' />
				</Box>

				<Box py={4}>
					<div className='flex flex-col'
						style={{
							width: '70rem',
						}}>
						<WhiteBorder>
							<Box p={2}>
								{children}
							</Box>
						</WhiteBorder>
					</div>
				</Box>
			</div>
		</div>
	)
}