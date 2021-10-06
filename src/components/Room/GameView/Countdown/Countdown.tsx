import moment from 'moment';
import React, { useEffect, useState } from 'react';

interface TimerProps {
	limitDate: moment.Moment;
	onFinish: () => void;
}

export default function Timer(props: TimerProps): JSX.Element {

	const [timeLeft, setTimeLeft] = useState<number>();
	const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>();

	const updateTimeLeft = () => {
		setTimeLeft(Math.max(0, moment(props.limitDate).diff(moment(), 'milliseconds')));
	}

	useEffect(() => {
		if(!props.limitDate) return;
		updateTimeLeft();

		if(currentInterval) {
			clearInterval(currentInterval);
		}

		setCurrentInterval(setInterval(() => {
			updateTimeLeft()
		}, 10));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.limitDate])

	useEffect(() => {			
		if(timeLeft === 0) {
			if(currentInterval) {
				clearInterval(currentInterval);
			}
			if(props.onFinish) {
				props.onFinish();
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeLeft, currentInterval])

	return props.limitDate ? (
		<div>
			Timer: {moment(props.limitDate).format('mm:ss')}
			<br/>
			Diff: {timeLeft}
		</div>
	) : <div>Vide</div>
}
