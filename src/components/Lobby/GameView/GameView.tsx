import React, { useEffect, useState } from 'react';
import { Game, Lobby } from '../../../../server/classes';
import Player from '../../../../server/classes/Player';
import useLocalStorage from '../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../hooks/useLocalStorage/useLocalStorage.types';
import { Layout, SectionTitle, Button, Avatar } from '../../../components/Common';
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
import { DrawPermission, drawState, Engine, IAction, ShapeType } from 'memo-draw-engine';
import NetworkManager from '../../../services/NetworkManager/NetworkManager';

interface GameProps {
	game: Game;
	updateLobby: (lobby: Lobby) => void;
	socket: Socket;
}

export default function GameView(props: GameProps): JSX.Element {
	const { t } = useTranslation();
	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);

	const [currentPlayer, setCurrentPlayer] = useState<Player>(props.game.players[props.game.currentPlayerIndex])
	const [isStartVoteModalVisible, setIsStartVoteModalVisible] = useState(false);
	const [selectedDrawing, setSelectedDrawing] = useState<number | undefined>(1);
	const [isCurrentVoteModalVisible, setIsCurrentVoteModalVisible] = useState(false);
	const [engine, setEngine] = useState<Engine>();

	useEffect(() => {
		if (!engine) return;

		engine.eventManager.registerDefaultCanvasAndDocumentEvents();
		drawState.shapeType = ShapeType.Pencil;
		drawState.drawPermission = DrawPermission.Slave;
		drawState.thickness = 5;

		updateDrawingPermission();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [engine])

	useEffect(() => {
		if (!engine || !props.socket) return;

		engine.registerNetworkManager(new NetworkManager(props.socket));

		props.socket.on('network-manager-update', (elem: IAction) => {
			engine.networkManager.notify(elem);
		})
	}, [engine, props.socket])

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
		}
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
			<div className='flex flex-row'>
				<div className='flex flex-col flex-initial w-52'>
					<div className='h-16'>
						<SectionTitle hintColor="text-yellow-light-yellow">{t('gameView.playersTitle')}</SectionTitle>
					</div>
					<div className=''>
						{
							props.game?.players.map((player: Player) => (
								<UserEtiquette key={player.id} player={player} creatorId={props.game.hostPlayerId} currentPlayer={currentPlayer} />
							))
						}
					</div>
				</div>
				<div className='flex flex-col flex-shrink-0 ml-8 mr-8'>
					<div className='flex flex-row justify-between'>
						<div className='h-16'>
							<Countdown limitDate={dayjs(props.game.limitDate)} onFinish={nextDrawing} />
						</div>

						<div className="bg-pink-dark-pink rounded-md p-3 h-12 w-24">
							<span className="text-lg font-semibold text-white-white">{props.game.currentDrawingIndex}/{props.game.currentNumberOfDrawings}</span>
						</div>
					</div>
					<div>
						<Canvas engine={engine} setEngine={setEngine} />
					</div>
					<div className='bg-blue-darker-blue rounded-md mt-4 h-20 text-lg font-semibold text-white-white text-center'>
						Tool selection
					</div>
				</div>
				<div className='flex flex-col justify-between flex-initial w-52'>

					<div className='flex flex-row items-center bg-blue-darker-blue rounded-md p-3 h-12'>
						<div className='w-10'>
							<Avatar avatar={currentPlayer.profile.avatar} />
						</div>
						<div className='font-semibold text-white-white truncate m-4'>
							{currentPlayer.profile.username} turn !
						</div>
					</div>

					<div className='bg-blue-darker-blue rounded-md flex-grow text-lg font-semibold text-white-white text-center mt-4 mb-4'>
						Color palette selection
					</div>

					<div>
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
				</div>
			</div>
		</Layout >
	)
}