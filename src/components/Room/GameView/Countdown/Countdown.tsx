import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';

interface CountdownProps {
	limitDate: Dayjs;
	onFinish: () => void;
}

export default function Countdown(props: CountdownProps): JSX.Element {

	const [timeLeft, setTimeLeft] = useState<number>();
	const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>();

	const updateTimeLeft = () => {
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
		if (dayjs().isAfter(props.limitDate)) {
			clearIntervalIfExist();

			if (props.onFinish) {
				props.onFinish();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeLeft, currentInterval])

	return props.limitDate ? (
		<div className="max-w-sm bg-blue-darker-blue rounded-md p-3 h-16 w-16">
			<div className="text-lg font-semibold text-white-white">{Math.floor(timeLeft / 1000)} s</div>
		</div>
	) : <div>Vide</div>
}
