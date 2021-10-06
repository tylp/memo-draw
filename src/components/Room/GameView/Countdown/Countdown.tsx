import moment from 'moment';
import React, { useEffect, useState } from 'react';

interface TimerProps {
	limitDate: moment.Moment;
	onFinish: () => void;
}

export default function Timer(props: TimerProps): JSX.Element {

	const [timeDiff, setTimeDiff] = useState<number>();
	const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>();

	const updateTimeDiff = () => {
		setTimeDiff(Math.max(0, moment(props.limitDate).diff(moment(), 'milliseconds')));
	}

	useEffect(() => {
		if(!props.limitDate) return;
		updateTimeDiff();

		setCurrentInterval(setInterval(() => {
			updateTimeDiff()
		}, 10));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.limitDate])

	useEffect(() => {			
		if(timeDiff === 0) {
			if(currentInterval) {
				clearInterval(currentInterval);
			}
			if(props.onFinish) {
				props.onFinish();
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeDiff, currentInterval])

	return moment(props.limitDate) && moment(props.limitDate).format ? (
		<div>
			Timer: {moment(props.limitDate).format('mm:ss')}
			<br/>
			Diff: {timeDiff}
		</div>
	) : <div>Vide</div>
}
