import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CountdownProps {
	limitDate: undefined | Dayjs;
	timeoutText?: undefined | string;
	onFinish?: undefined | (() => void);
}

export default function Countdown(props: CountdownProps): JSX.Element {

	const [timeLeft, setTimeLeft] = useState<number>();
	const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>();

	const updateTimeLeft = () => {
		if (!props.limitDate) return;

		const timeBetweenNowAndLimitDate = props.limitDate.diff(dayjs(), 'milliseconds');
		setTimeLeft(Math.max(0, timeBetweenNowAndLimitDate));
	}

	const clearIntervalIfExist = () => {
		if (currentInterval) clearInterval(currentInterval);
	}

	useEffect(() => {
		clearIntervalIfExist();

		updateTimeLeft();

		if (!props.limitDate) return;

		setCurrentInterval(setInterval(() => {
			updateTimeLeft()
		}, 10));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.limitDate])

	useEffect(() => {
		if (!props.limitDate) return;

		if (dayjs().isAfter(props.limitDate)) {
			clearIntervalIfExist();

			props.onFinish?.();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeLeft, currentInterval])

	return (
		<div className='flex flex-row items-center justify-between bg-blue-darker-blue rounded-md h-full p-4 w-24'>
			<FontAwesomeIcon icon={faClock} className='text-yellow-light-yellow' />
			{
				props.limitDate ? (
					<div className='ml-2 text-lg font-semibold text-white-white'>{Math.floor(timeLeft / 1000)} s</div>
				) : (
					<div className='ml-2 text-lg font-semibold text-white-white'>{props.timeoutText || ''}</div>
				)
			}
		</div>
	)
}
