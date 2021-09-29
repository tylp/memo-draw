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

	const intervalHandler = () => {
		setTimeDiff(getTimeDifference());
	}

	useEffect(() => {
		setInterval(intervalHandler, 1000);
	}, [])

	useEffect(() => {
		if(timeDiff < 0) {
			props.onFinish();
		}
		getTimeDifference();
	}, [timeDiff]);

	useEffect(() => {
		setLimitDate(moment(props.game.limitDate));
	}, [props.game.limitDate]);

	return (
		<div>
			Timer: {limitDate.format('hh:mm:ss')}
			<br/>
			Diff: {timeDiff}
		</div>
	)
}
