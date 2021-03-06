/* eslint-disable react-hooks/exhaustive-deps */
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
		setCurrentInterval(
			setInterval(() => { updateTimeLeft() }, 10),
		);
	}, [props.limitDate]);

	useEffect(() => {
		if (!props.limitDate) return;
		if (dayjs().isAfter(props.limitDate)) {
			clearIntervalIfExist();
			props.onFinish?.();
		}
	}, [timeLeft, currentInterval])

	const content = props.limitDate ? `${Math.floor(timeLeft / 1000)} s` : (props.timeoutText || '');

	return (
		<div className="flex flex-row items-center justify-between bg-blue-darker-blue rounded-md px-3 py-1">
			<FontAwesomeIcon icon={faClock} className="text-yellow-light-yellow" />
			<div className="ml-2 text-lg font-semibold text-white-white">
				{content}
			</div>
		</div>
	)
}

