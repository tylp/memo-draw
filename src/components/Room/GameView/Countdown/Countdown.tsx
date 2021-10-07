import moment from 'moment';
import React, { useEffect, useState } from 'react';

interface TimerProps {
	limitDate: moment.Moment;
	onFinish: () => void;
}

export default function Timer(props: TimerProps): JSX.Element {

	const [timeLeft, setTimeLeft] = useState<number>();
	const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>();

	const timeBetweenNowAndLimitDate = moment(props.limitDate).diff(moment(), 'milliseconds');

	const updateTimeLeft = () => {
		setTimeLeft(Math.max(0, timeBetweenNowAndLimitDate));
	}

	const clearIntervalIfExist = () => {
		if(currentInterval) clearInterval(currentInterval);
	}

	useEffect(() => {
		clearIntervalIfExist();

		updateTimeLeft();

		if(!props.limitDate) return;

		setCurrentInterval(setInterval(() => {
			updateTimeLeft()
		}, 10));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.limitDate])

	useEffect(() => {			
		if(moment().isAfter(props.limitDate)) {
			clearIntervalIfExist();

			if(props.onFinish) {
				props.onFinish();
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeLeft, currentInterval])

	return props.limitDate ? (
		<div className="max-w-sm bg-blue-darker-blue rounded-md p-3 h-16 w-16">
			<div className="text-lg font-semibold text-white-white">{Math.floor(timeLeft/1000)} s</div>
		</div>
	) : <div>Vide</div>
}
