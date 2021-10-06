import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Game } from '../../../../../server/classes/Game';

interface TimerProps {
	game: Game;
	onFinish: () => void;
}

export default function Timer(props: TimerProps): JSX.Element {

	const [timeDiff, setTimeDiff] = useState<number>();
	const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>();

	useEffect(() => {
		if(!props.game) return;
		setTimeDiff(moment(props.game.limitDate).diff(moment(), 'seconds'));

		if(currentInterval) {
			clearInterval(currentInterval);
		}

		console.log('setting an interval', moment(props.game.limitDate))
		setCurrentInterval(setInterval(() => {
			setTimeDiff(moment(props.game.limitDate).diff(moment(), 'seconds'));
		}, 1000));
	}, [props.game.limitDate])

	useEffect(() => {			
		if(timeDiff < 0) {
			clearInterval(currentInterval);
			props.onFinish();
		}
	}, [timeDiff])

	return moment(props.game.limitDate) && moment(props.game.limitDate).format ? (
		<div>
			Timer: {moment(props.game.limitDate).format('mm:ss')}
			<br/>
			Diff: {timeDiff}
		</div>
	) : <div>Vide</div>
}
