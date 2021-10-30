import React, { useEffect, useState } from 'react';
import { Game } from '../../../../server/classes';
import Player from '../../../../server/classes/Player';
import { useSocketLobby } from '../../../hooks';
import useLocalStorage from '../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../hooks/useLocalStorage/useLocalStorage.types';
import { Layout, SectionTitle, Button } from '../../../components/Common';
import UserProfile from './UserProfile/UserProfile';
import Countdown from './Countdown/Countdown';
import dayjs from 'dayjs';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { useTranslation } from 'react-i18next';
import Modal from '../../Common/Modal/Modal';
import DrawingSelector from './DrawingSelector/DrawingSelector';

interface GameProps {
	game: Game;
}

export default function GameView(props: GameProps): JSX.Element {
	const socket = useSocketLobby();
	const { t } = useTranslation();
	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);

	const [currentPlayer, setCurrentPlayer] = useState<Player>(props.game.players[props.game.currentPlayerIndex])
	const [isStartVoteModalVisible, setIsStartVoteModalVisible] = useState(false);
	const [selectedDrawing, setSelectedDrawing] = useState<number | undefined>(1);
	const [isCurrentVoteModalVisible, setIsCurrentVoteModalVisible] = useState(false);

	useEffect(() => {
		if (props.game) {
			setCurrentPlayer(props.game.players[props.game.currentPlayerIndex])
			setIsCurrentVoteModalVisible(!!props.game.currentVote)
		}
	}, [props.game])

	const nextDrawing = () => {
		if (!socket) return;
		if (playerId === currentPlayer.id) {
			socket.emit('next-drawing')
		}
	}

	const startVote = () => {
		if (!socket) return;
		if (playerId !== currentPlayer.id && selectedDrawing) {
			socket.emit('start-vote', selectedDrawing);
			setIsStartVoteModalVisible(false);
		}
	}

	return (
		<Layout>
			<Modal
				visible={isStartVoteModalVisible}
				onClose={() => setIsStartVoteModalVisible(false)}
				onValidate={startVote}
				disableValidate={!selectedDrawing}
				title={t('gameView.startVote')}
			>
				<p className="my-4 text-blueGray-500 text-lg leading-relaxed">
					<DrawingSelector list={[1, 2, 3]} selected={selectedDrawing} setSelected={setSelectedDrawing} />
				</p>
			</Modal>
			<Modal
				visible={isCurrentVoteModalVisible}
				onClose={() => setIsCurrentVoteModalVisible(false)}
				showValidate={false}
				showCancel={false}
				title={t('gameView.startVote')}
			>
				<p>Vote has started</p>
			</Modal>
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
				<div>
					{
						playerId !== currentPlayer.id ? (
							<Button
								color='primary' size='medium' icon={faArrowRight}
								onClick={() => setIsStartVoteModalVisible(true)}>
								{t('gameView.startVote')}
							</Button>
						) : null
					}
				</div>
			</div>
		</Layout >
	)
}