import React, { useEffect, useState } from 'react';
import { Game } from '../../../../server/classes/Game';
import Player from '../../../../server/classes/Player';
import { useSocketRoom } from '../../../hooks';
import useLocalStorage from '../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../hooks/useLocalStorage/useLocalStorage.types';
import { Layout, SectionTitle } from '../../Common';
import Button from '../../Common/Button/Button';
import UserProfile from './UserProfile';
import Countdown from './Countdown/Countdown';
import dayjs from 'dayjs';

interface GameProps {
	game: Game;
}

export function GameView(props: GameProps): JSX.Element {
	const socket = useSocketRoom();
	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);

	const [currentPlayer, setCurrentPlayer] = useState<Player>(props.game.players[props.game.currentPlayerIndex])

	useEffect(() => {
		if (props.game) {
			setCurrentPlayer(props.game.players[props.game.currentPlayerIndex])
		}
	}, [props.game])

	const nextDrawing = () => {
		if (playerId === currentPlayer.id) {
			socket.emit('next-drawing')
		}
	}

	return (
		<Layout>
			<div className="flex flex-wrap flex-auto justify-center md:space-x-32">
				<div>
					<SectionTitle hintColor="text-yellow-light-yellow">Players</SectionTitle>
					{
						props.game?.players.map((player: Player) => (
							<UserProfile key={player.id} player={player} creatorId={props.game.creatorPlayerId} currentPlayer={currentPlayer} />
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
							<Button onClick={nextDrawing}>
								Envoyer
							</Button>
						) : null
					}
				</div>
			</div>
		</Layout>
	)
}