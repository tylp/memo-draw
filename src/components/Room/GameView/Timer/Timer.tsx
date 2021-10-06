import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Game } from '../../../../../server/classes/Game';
import Button from '../../../Common/Button/Button';

interface TimerProps {
	game: Game;
	onFinish: () => void;
};

export default function Timer(props: TimerProps): JSX.Element {

	const getTimeDifference = (): number => {
		return limitDate.diff(moment(), 'seconds');
	}

	const [limitDate, setLimitDate] = useState(moment(props.game.limitDate));
	const [timeDiff, setTimeDiff] = useState(getTimeDifference());
	const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>();

	const intervalHandler = () => {
		setTimeDiff(getTimeDifference());
	}

	useEffect(() => {
		setCurrentInterval(setInterval(intervalHandler, 1000));
	}, [])

	useEffect(() => {
		if(timeDiff < 0) {
			clearInterval(currentInterval);
			props.onFinish();
		}
		getTimeDifference();
	}, [timeDiff]);

	useEffect(() => {
		setCurrentInterval(setInterval(intervalHandler, 1000));
		setLimitDate(moment(props.game.limitDate));
	}, [props.game.limitDate]);

	return (
		<div>
			Timer: {limitDate.format('mm:ss')}
			<br/>
			Diff: {timeDiff}
		</div>
	)
}
