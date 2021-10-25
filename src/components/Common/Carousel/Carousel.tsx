import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface ButtonSpec {
	children: ReactNode,
}

export default function Carousel(props: ButtonSpec): JSX.Element {

	const leftArrow = useRef<HTMLDivElement>(null);
	const rightArrow = useRef<HTMLDivElement>(null);
	const container = useRef<HTMLDivElement>(null);
	const [isMaxLeft, setIsMaxLeft] = useState(false);
	const [isMaxRight, setIsMaxRight] = useState(false);

	const [scrollerInterval, setScrollerInterval] = useState<NodeJS.Timer>();

	const calculateMaxScroll = () => {
		if (container.current) {
			const maxScrollLeft = container.current.scrollWidth - container.current.clientWidth;
			setIsMaxLeft(container.current.scrollLeft === 0);
			setIsMaxRight(container.current.scrollLeft >= maxScrollLeft);
		}
	}

	useEffect(() => {
		calculateMaxScroll();
	}, [props.children])

	useEffect(() => {
		container.current.addEventListener('scroll', calculateMaxScroll)
	}, [])

	useEffect(() => {
		const scrollerSpeed = 5;

		const startScroll = (speed: number) => {
			setScrollerInterval(setInterval(() => {
				container.current.scrollLeft += speed;
			}, 10))
		}

		const stopScroll = () => {
			if (scrollerInterval) {
				clearInterval(scrollerInterval);
				setScrollerInterval(null);
			}
		}

		const startScrollLeft = () => {
			startScroll(-scrollerSpeed);
		}

		const startScrollRight = () => {
			startScroll(scrollerSpeed);
		}

		if (leftArrow.current) {
			leftArrow.current.addEventListener('mouseenter', startScrollLeft);
			leftArrow.current.addEventListener('mouseleave', stopScroll);
		}

		if (rightArrow.current) {
			rightArrow.current.addEventListener('mouseenter', startScrollRight);
			rightArrow.current.addEventListener('mouseleave', stopScroll);
		}

		const leftArrowRef = leftArrow.current;
		const rightArrowRef = rightArrow.current;

		return () => {
			rightArrowRef.removeEventListener('mouseenter', startScrollRight);
			leftArrowRef.removeEventListener('mouseenter', startScrollLeft);
		}
	}, [scrollerInterval])

	return (
		<>
			<div ref={leftArrow}>
				<FontAwesomeIcon opacity={isMaxLeft ? 0.5 : 1} className={`${isMaxLeft ? 'cursor-default' : 'cursor-pointer'} pointer-events-auto text-white-white`} size="4x" icon={faChevronLeft} />
			</div>
			<div ref={container} className="overflow-x-scroll no-scrollbar">
				<div className="flex flex-row items-center">
					{
						props.children
					}
				</div>
			</div>
			<div ref={rightArrow}>
				<FontAwesomeIcon opacity={isMaxRight ? 0.5 : 1} className={`${isMaxRight ? 'cursor-default' : 'cursor-pointer'} pointer-events-auto text-white-white`} size="4x" icon={faChevronRight} />
			</div>
		</>
	)
}
