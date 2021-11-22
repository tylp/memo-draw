import React, { useEffect, useState } from 'react';
import { Game, Lobby } from '../../../../server/classes';
import Player from '../../../../server/classes/Player';
import useLocalStorage from '../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../hooks/useLocalStorage/useLocalStorage.types';
import { Layout, SectionTitle, Button } from '../../../components/Common';
import UserEtiquette from './UserEtiquette/UserEtiquette';
import Countdown from './Countdown/Countdown';
import dayjs from 'dayjs';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { useTranslation } from 'react-i18next';
import Modal from '../../Common/Modal/Modal';
import DrawingSelector from './DrawingSelector/DrawingSelector';
import { Col, Row } from 'react-grid-system';
import { YesOrNo } from '../../../../server/classes/Votes/YesNoVote';
import { Socket } from 'socket.io-client';
import Canvas from './Canvas/Canvas';
import SocketEventEmitter from '../../../services/SocketEventEmitter';
import { DrawPermission, drawState, Engine, ShapeType } from 'memo-draw-engine';

interface GameProps {
	game: Game;
	updateLobby: (lobby: Lobby) => void;
	socket: typeof Socket;
}

export default function GameView(props: GameProps): JSX.Element {
	const { t } = useTranslation();
	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);

	const [currentPlayer, setCurrentPlayer] = useState<Player>(props.game.players[props.game.currentPlayerIndex])
	const [isStartVoteModalVisible, setIsStartVoteModalVisible] = useState(false);
	const [selectedDrawing, setSelectedDrawing] = useState<number | undefined>(1);
	const [isCurrentVoteModalVisible, setIsCurrentVoteModalVisible] = useState(false);
	const [engine, setEngine] = useState<Engine>();
	const [hasLost, setHasLost] = useState<boolean>();
	const [, setHasGameEnded] = useState<boolean>();

	useEffect(() => {
		if (!engine) return;

		engine.eventManager.registerDefaultCanvasAndDocumentEvents();
		drawState.shapeType = ShapeType.Pencil;
		drawState.drawPermission = DrawPermission.Slave;
		drawState.thickness = 5;
		updateDrawingPermission();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [engine])

	const updateDrawingPermission = () => {
		drawState.drawPermission = currentPlayer.id === playerId ? DrawPermission.Master : DrawPermission.Slave;
	}

	useEffect(() => {
		updateDrawingPermission();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPlayer])

	useEffect(() => {
		props.socket.on('vote-started', (lobby: Lobby) => {
			setIsCurrentVoteModalVisible(true)
			props.updateLobby(lobby);
		})

		props.socket.on('stop-vote', (lobby: Lobby) => {
			setIsCurrentVoteModalVisible(false)
			props.updateLobby(lobby);
		})

		return () => {
			props.socket.off('vote-started');
			props.socket.off('stop-vote');
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket])

	useEffect(() => {
		if (props.game) {
			setCurrentPlayer(props.game.players[props.game.currentPlayerIndex])
			setHasLost(props.game.losers.map(e => e.id).includes(playerId as string));
			setHasGameEnded(props.game.hasEnded)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.game])

	const nextDrawing = () => {
		if (playerId === currentPlayer.id) {
			SocketEventEmitter.nextDrawing(props.socket);
		}
	}

	const startVote = () => {
		if (playerId !== currentPlayer.id && selectedDrawing) {
			SocketEventEmitter.startVote(props.socket, selectedDrawing);
			setIsStartVoteModalVisible(false);
		}
	}

	const vote = (vote: YesOrNo) => {
		SocketEventEmitter.vote(props.socket, vote);
	}

	const getPillTitle = (player: Player): undefined | string => {
		if (currentPlayer.id === player.id) {
			return t('gameView.currentlyDrawing');
		}

		return undefined;
	}

	const hasPlayerLost = (player: Player): boolean => {
		return props.game.losers.map(e => e.id).includes(player.id)
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
				title={t('gameView.isThisDrawingValid')}
			>
				<Row>
					<Col>
						<Button color="primary" size="small" fullWidth onClick={() => vote('yes')}>{t('gameView.yes')}</Button>
					</Col>
					<Col>
						<Button color="primary" size="small" fullWidth onClick={() => vote('no')}>{t('gameView.no')}</Button>
					</Col>
				</Row>
			</Modal>
			<div className="flex flex-wrap flex-auto justify-center md:space-x-32">
				<div>
					<SectionTitle hintColor="text-yellow-light-yellow">{t('gameView.playersTitle')}</SectionTitle>
					{
						props.game?.players.map((player: Player) => (
							<UserEtiquette key={player.id} player={player} color='secondary' disabled={hasPlayerLost(player)} pillTitle={getPillTitle(player)} />
						))
					}
				</div>
				<div>
					<Canvas engine={engine} setEngine={setEngine} />
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
								color='primary'
								size='medium'
								icon={faArrowRight}
								disabled={hasLost}
								onClick={nextDrawing}>
								{t('gameView.sendDrawing')}
							</Button>
						) : null
					}
				</div>
				<div>
					{
						(playerId !== currentPlayer.id) ? (
							<Button
								color='primary'
								size='medium'
								icon={faArrowRight}
								disabled={hasLost}
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