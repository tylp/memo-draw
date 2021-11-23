import React, { useEffect, useState } from 'react';
import { Lobby } from '../../../../server/classes';
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
import PlayerSelector from './PlayerSelector/PlayerSelector';
import { Col, Row } from 'react-grid-system';
import { YesOrNo } from '../../../../server/classes/Votes/YesNoVote';
import { Socket } from 'socket.io-client';
import Canvas from './Canvas/Canvas';
import SocketEventEmitter from '../../../services/SocketEventEmitter';
import { DrawPermission, drawState, Engine, IAction, ShapeType } from 'memo-draw-engine';
import NetworkManager from '../../../services/NetworkManager/NetworkManager';
import Box from '../../Common/Box/Box';
import _ from 'lodash';

interface GameProps {
	lobby: Lobby;
	updateLobby: (lobby: Lobby) => void;
	leaveGame: () => void;
	socket: Socket;
}

export default function GameView(props: GameProps): JSX.Element {
	const { t } = useTranslation();
	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);

	const [currentPlayer, setCurrentPlayer] = useState<Player>(props.lobby.game.players[props.lobby.game.currentPlayerIndex])
	const [isStartVoteModalVisible, setIsStartVoteModalVisible] = useState(false);
	const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
	const [isCurrentVoteModalVisible, setIsCurrentVoteModalVisible] = useState(false);
	const [engine, setEngine] = useState<Engine>();
	const [hasLost, setHasLost] = useState<boolean>();
	const [, setHasGameEnded] = useState<boolean>();
	const [currentVote, setCurrentVote] = useState<YesOrNo>();
	const [spectators, setSpectators] = useState<Player[]>([]);

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
			setIsCurrentVoteModalVisible(lobby.game.playerErrorVoteManager.selectedPlayer.id !== playerId);
			props.updateLobby(lobby);
		})

		props.socket.on('stop-vote', (lobby: Lobby) => {
			setIsCurrentVoteModalVisible(false)
			setCurrentVote(undefined);
			props.updateLobby(lobby);
		})

		return () => {
			props.socket.off('vote-started');
			props.socket.off('stop-vote');
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket])

	useEffect(() => {
		if (props.lobby.game) {
			setCurrentPlayer(props.lobby.game.players[props.lobby.game.currentPlayerIndex])
			setHasLost(props.lobby.game.losers.map(e => e.id).includes(playerId as string));
			setHasGameEnded(props.lobby.game.hasEnded)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.lobby.game])

	const nextDrawing = () => {
		if (playerId === currentPlayer.id) {
			SocketEventEmitter.nextDrawing(props.socket);
		}
	}

	const startVote = () => {
		if (playerId !== currentPlayer.id && selectedPlayer) {
			SocketEventEmitter.startVote(props.socket, selectedPlayer);
			setIsStartVoteModalVisible(false);
		}
	}

	const vote = (vote: YesOrNo) => {
		setCurrentVote(vote);
		SocketEventEmitter.vote(props.socket, vote);
	}

	const getPillTitleDrawing = (player: Player): undefined | string => {
		return (player.id === currentPlayer.id) ? t('gameView.currentlyDrawing') : undefined;
	}

	const getPillTitleItsYou = (player: Player): undefined | string => {
		return (player.id === playerId) ? t('gameView.itsYouLabel') : undefined;
	}

	const hasPlayerLost = (player: Player): boolean => {
		return props.lobby.game.losers.map(e => e.id).includes(player.id)
	}

	useEffect(() => {
		const idsNotInGame = _.difference(props.lobby.players.map(e => e.id), props.lobby?.game?.players.map(e => e.id));
		setSpectators(props.lobby.players.filter((player: Player) => {
			return idsNotInGame.includes(player.id)
		}));
	}, [props.lobby.players, props.lobby?.game?.players]);

	return (
		<Layout>
			<Modal
				visible={isStartVoteModalVisible}
				onClose={() => setIsStartVoteModalVisible(false)}
				onValidate={startVote}
				disableValidate={!selectedPlayer}
				title={t('gameView.startVote')}
			>
				<Box className={'w-full'}>
					<PlayerSelector list={props.lobby.game.players.filter((player: Player) => player.id !== playerId)} selected={selectedPlayer} setSelected={setSelectedPlayer} />
				</Box>
			</Modal>
			<Modal
				visible={isCurrentVoteModalVisible}
				onClose={() => setIsCurrentVoteModalVisible(false)}
				showValidate={false}
				showCancel={false}
				title={t('gameView.hasThisPlayerMadeAnError')}
			>
				<Row>
					<Col>
						{
							props.lobby.game?.playerErrorVoteManager?.selectedPlayer && (
								<UserEtiquette player={props.lobby.game.playerErrorVoteManager.selectedPlayer} color="secondary"></UserEtiquette>
							)
						}
					</Col>
				</Row>
				<Row>
					<Col>
						<Button color="primary" selected={currentVote === 'yes'} size="small" fullWidth onClick={() => vote('yes')}>{t('gameView.yes')}</Button>
					</Col>
					<Col>
						<Button color="primary" selected={currentVote === 'no'} size="small" fullWidth onClick={() => vote('no')}>{t('gameView.no')}</Button>
					</Col>
				</Row>
			</Modal>
			<div className='flex flex-row justify-center'>
				<div className='flex flex-col flex-1 w-52'>
					<div className='h-16'>
						<SectionTitle hintColor="text-yellow-light-yellow">{t('gameView.playersTitle')}</SectionTitle>
					</div>
					<div>
						{
							props.lobby.game?.players.map((player: Player) => (
								<UserEtiquette key={player.id} player={player} color='secondary' disabled={hasPlayerLost(player)} rPillTitle={getPillTitleItsYou(player)} brPillTitle={getPillTitleDrawing(player)} />
							))
						}
					</div>
					{
						spectators.length > 0 && (
							<>
								<div className='h-16'>
									<SectionTitle hintColor="text-yellow-light-yellow">{t('gameView.spectatorsTitle')}</SectionTitle>
								</div>
								<div>
									{
										spectators.map((player: Player) => (
											<UserEtiquette key={player.id} player={player} color='light-secondary' rPillTitle={getPillTitleItsYou(player)} />
										))
									}
								</div>
							</>
						)
					}
				</div>
				<div className='flex flex-col flex-shrink-0 ml-8 mr-8'>
					<div className='flex flex-row justify-between'>
						<div className='h-16'>
							<Countdown limitDate={dayjs(props.lobby.game.limitDate)} onFinish={nextDrawing} />
						</div>
						<div className="bg-pink-dark-pink rounded-md p-3 h-12 w-24 text-center">
							<span className="text-lg font-semibold text-white-white">{props.lobby.game.currentDrawingIndex}/{props.lobby.game.currentNumberOfDrawings}</span>
						</div>
					</div>
					<div>
						<Canvas engine={engine} setEngine={setEngine} />
					</div>
					<div className='bg-blue-darker-blue rounded-md mt-4 h-20 text-lg font-semibold text-white-white text-center'>
						Tool selection
					</div>
				</div>
				<div className='flex flex-col justify-between flex-1 w-52'>
					<div className='h-12'>
						{
							(hasLost) ? (
								<Button
									color='primary'
									size='medium'
									fullHeight
									fullWidth
									icon={faArrowRight}
									disabled={!(hasLost || spectators.map(e => e.id).includes(playerId as string))}
									onClick={props.leaveGame}>
									{t('lobbyView.leaveBtnLabel')}
								</Button>
							) : null
						}
					</div>
					<div className='bg-blue-darker-blue rounded-md flex-grow text-lg font-semibold text-white-white text-center mt-4 mb-4'>
						Color palette selection
					</div>
					<div className='h-20'>
						{
							playerId === currentPlayer.id ? (
								<Button
									color='primary'
									size='medium'
									fullHeight
									fullWidth
									icon={faArrowRight}
									disabled={hasLost}
									onClick={nextDrawing}>
									{t('gameView.sendDrawing')}
								</Button>
							) : (
								<Button
									color='primary'
									size='medium'
									fullHeight
									fullWidth
									icon={faArrowRight}
									disabled={hasLost || !props.lobby.game.players.map(e => e.id).includes(playerId as string)}
									onClick={() => setIsStartVoteModalVisible(true)}>
									{t('gameView.startVote')}
								</Button>
							)
						}
					</div>
				</div>
			</div>
		</Layout >
	)
}