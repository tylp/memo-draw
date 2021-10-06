import moment from 'moment';
import React, { useEffect, useState } from 'react';

interface TimerProps {
	limitDate: moment.Moment;
	onFinish: () => void;
}

export default function Timer(props: TimerProps): JSX.Element {

	const [timeDiff, setTimeDiff] = useState<number>();
	const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>();

	useEffect(() => {
		if(!props.limitDate) return;
		setTimeDiff(moment(props.limitDate).diff(moment(), 'seconds'));

		if(currentInterval) {
			clearInterval(currentInterval);
		}

		console.log('setting an interval', moment(props.limitDate))
		setCurrentInterval(setInterval(() => {
			setTimeDiff(moment(props.limitDate).diff(moment(), 'seconds'));
		}, 1000));
	}, [props.limitDate])

	useEffect(() => {			
		if(timeDiff < 0) {
			clearInterval(currentInterval);
			props.onFinish();
		}
	}, [timeDiff])

	return moment(props.limitDate) && moment(props.limitDate).format ? (
		<div>
			Timer: {moment(props.limitDate).format('mm:ss')}
			<br/>
			Diff: {timeDiff}
		</div>
	) : <div>Vide</div>
}
