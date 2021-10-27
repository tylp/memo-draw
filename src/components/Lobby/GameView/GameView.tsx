import React, { useEffect, useState } from 'react';
import { Game } from '../../../../server/classes/Game';
import Player from '../../../../server/classes/Player';
import { useSocketRoom } from '../../../hooks';
import useLocalStorage from '../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../hooks/useLocalStorage/useLocalStorage.types';
import { Layout, SectionTitle, Button } from '../../../components/Common';
import UserProfile from './UserProfile/UserProfile';
import Countdown from './Countdown/Countdown';
import dayjs from 'dayjs';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { useTranslation } from 'react-i18next';

interface GameProps {
	game: Game;
}

export default function GameView(props: GameProps): JSX.Element {
	const socket = useSocketRoom();
	const { t } = useTranslation();
	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);

	const [currentPlayer, setCurrentPlayer] = useState<Player>(props.game.players[props.game.currentPlayerIndex])

	useEffect(() => {
		if (props.game) {
			setCurrentPlayer(props.game.players[props.game.currentPlayerIndex])
		}
	}, [props.game])

	const nextDrawing = () => {
		if (!socket) return;
		if (playerId === currentPlayer.id) {
			socket.emit('next-drawing')
		}
	}

	return (
		<Layout>
			<div className="flex flex-wrap flex-auto justify-center md:space-x-32">
				<div>
					<SectionTitle hintColor="text-yellow-light-yellow">{t('gameView.playersTitle')}</SectionTitle>
					{
						props.game?.players.map((player: Player) => (
							<UserProfile key={player.id} player={player} creatorId={props.game.hostPlayerId} currentPlayer={currentPlayer} />
						))
					}
				</div>
				<div>
					Drawing Board Here
					Current Drawing: {props.game.currentDrawingIndex}/{props.game.currentNumberOfDrawings}
					Current Player: {props.game.currentPlayerIndex}
				</div>
				<Countdown limitDate={dayjs(props.game.limitDate)} onFinish={nextDrawing} />
				<div>
					{
						playerId === currentPlayer.id ? (
							<Button
								color='primary' size='medium' icon={faArrowRight}
								onClick={nextDrawing}>
								{t('gameView.sendDrawing')}
							</Button>
						) : null
					}
				</div>
			</div>
		</Layout>
	)
}