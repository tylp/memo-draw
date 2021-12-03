import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { Engine } from 'memo-draw-engine';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { Socket } from 'socket.io-client';
import { Lobby, Player } from '../../../../../server/classes';
import { YesOrNo } from '../../../../../server/classes/Votes/YesNoVote';
import useLocalStorage from '../../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../../hooks/useLocalStorage/useLocalStorage.types';
import SocketEventEmitter from '../../../../services/SocketEventEmitter';
import VoteTargets from '../../../../services/VoteTargets/VoteTargets';
import { Box, Button, Layout, Modal } from '../../../Common'
import UserEtiquette from '../../UserEtiquette/UserEtiquette';
import BottomToolBox from '../Canvas/Toolbox/BottomToolBox';
import { EngineContextProvider } from '../Canvas/Toolbox/EngineContext';
import RightToolBox from '../Canvas/Toolbox/RightToolBox';
import PlayersAndSpectators from '../PlayersAndSpectators/PlayersAndSpectators';
import Countdown from './Countdown/Countdown';
import PlayerSelector from './PlayerSelector/PlayerSelector'

import styles from '../../../../../styles/GameView.module.css';
import Canvas from '../Canvas/Canvas';

interface PlayerViewProps {
	lobby: Lobby;
	socket: Socket;
	currentPlayer: Player;
	updateLobby: (lobby: Lobby) => void;
	leaveGame: () => void;
	spectators: Player[];
	engine: Engine;
	setEngine: React.Dispatch<React.SetStateAction<Engine>>;
}

export default function PlayerView(props: PlayerViewProps): JSX.Element {
	const { t } = useTranslation();

	const [playerId] = useLocalStorage<Player['id']>(LocalStorageKey.PlayerId);

	const [isStartVoteModalVisible, setIsStartVoteModalVisible] = useState(false);
	const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
	const [isCurrentVoteModalVisible, setIsCurrentVoteModalVisible] = useState(false);
	const [currentVote, setCurrentVote] = useState<YesOrNo>();
	const [hasLost, setHasLost] = useState<boolean>();

	useEffect(() => {
		if (props.lobby.game) {
			setHasLost(props.lobby.game.losers.map(e => e.id).includes(playerId));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.lobby.game])


	useEffect(() => {
		props.socket.on('vote-started', (lobby: Lobby) => {
			setIsCurrentVoteModalVisible(lobby.game.playerErrorVoteManager.selectedPlayer.id !== playerId);
			props.updateLobby(lobby);
		})

		props.socket.on('stop-vote', () => {
			setIsCurrentVoteModalVisible(false)
			setCurrentVote(undefined);
		})

		return () => {
			props.socket.off('vote-started');
			props.socket.off('stop-vote');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket])

	const nextDrawing = () => {
		if (playerId === props.currentPlayer?.id) {
			SocketEventEmitter.nextDrawing(props.socket);
		}
	}

	const startVote = () => {
		if (playerId !== props.currentPlayer?.id && selectedPlayer) {
			SocketEventEmitter.startVote(props.socket, selectedPlayer);
			setIsStartVoteModalVisible(false);
		}
	}

	const vote = (vote: YesOrNo) => {
		if (currentVote === vote) return;

		setCurrentVote(vote);
		SocketEventEmitter.vote(props.socket, vote);
	}

	const getVoteTargets = (): Player[] => {
		return (new VoteTargets(props.lobby, playerId)).get();
	}

	return (
		<Layout size="large">
			<Modal
				visible={isStartVoteModalVisible}
				onClose={() => setIsStartVoteModalVisible(false)}
				onValidate={startVote}
				disableValidate={!selectedPlayer}
				title={t('gameView.startVote')}
			>
				<Box mb={2} className={'w-full'}>
					<PlayerSelector list={getVoteTargets()} selected={selectedPlayer} setSelected={setSelectedPlayer} />
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
						<div className="flex h-16 mb-2">
							<Box mr={2} className="flex-1">
								{props.lobby.game?.playerErrorVoteManager?.selectedPlayer && (
									<UserEtiquette
										player={props.lobby.game.playerErrorVoteManager.selectedPlayer}
										color="secondary"
									/>
								)}
							</Box>
							<div>
								<Countdown limitDate={dayjs(props.lobby.game.playerErrorVoteManager.voteEndDate)} />
							</div>
						</div>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button
							color={currentVote !== 'no' ? 'primary' : 'light-secondary'} size="small"
							selected={currentVote === 'yes'}
							fullWidth
							onClick={() => vote('yes')}
						>
							{t('gameView.yes')}
						</Button>
					</Col>
					<Col>
						<Button
							color={currentVote !== 'yes' ? 'primary' : 'light-secondary'}
							selected={currentVote === 'no'}
							size="small"
							fullWidth
							onClick={() => vote('no')}
						>
							{t('gameView.no')}
						</Button>
					</Col>
				</Row>
			</Modal>


			<EngineContextProvider engine={props.engine}>
				<div style={{ userSelect: 'none' }} className={`mt-6 ${styles['grid-3']}`}>
					<div className={`${styles['col-gap']} ${styles['player-overflow']}`}>
						<PlayersAndSpectators
							players={props.lobby.game?.players}
							spectators={props.spectators}
							losers={props.lobby.game.losers}
							playerId={playerId}
							currentPlayer={props.currentPlayer}
						/>
					</div>
					<div className={styles['col-gap']}>
						<div className="relative">
							<div className="absolute top-0 md:-top-11">
								<Countdown limitDate={dayjs(props.lobby.game.limitDate)} onFinish={nextDrawing} />
							</div>
							<div style={{ right: '0' }} className="absolute top-0 md:-top-11">
								<div className="bg-pink-dark-pink rounded-md px-3 py-1 text-center">
									<span className="text-lg font-semibold text-white-white">
										{props.lobby.game.currentDrawingIndex}/{props.lobby.game.currentNumberOfDrawings}
									</span>
								</div>
							</div>
						</div>
						<Canvas engine={props.engine} setEngine={props.setEngine} />
						<BottomToolBox />
					</div>
					<div className="h-full flex flex-col">
						<RightToolBox />
						<div style={{ height: '88px' }} className="flex flex-col">
							{hasLost && (
								<div style={{ height: '100%', paddingTop: '12px' }}>
									<Button
										color='primary' size='medium'
										fullHeight fullWidth
										icon={faArrowRight}
										disabled={!(hasLost || props.spectators.map(e => e.id).includes(playerId))}
										onClick={props.leaveGame}>
										{t('lobbyView.leaveBtnLabel')}
									</Button>
								</div>
							)}
							<StartVoteOrSendDrawing
								showDrawingButton={playerId === props.currentPlayer?.id}
								disableDrawingButton={hasLost}
								onClickDrawingButton={nextDrawing}
								disableStartVoteButton={hasLost || !props.lobby.game.players.map(e => e.id).includes(playerId)}
								onClickStartVoteButton={() => {
									setSelectedPlayer(undefined);
									setCurrentVote('yes');
									setIsStartVoteModalVisible(true);
								}}
							/>
						</div>
					</div>
				</div>
			</EngineContextProvider>
		</Layout>
	)
}

interface StartVoteOrSendDrawingProps {
	showDrawingButton: boolean;
	disableDrawingButton: boolean;
	onClickDrawingButton: () => void;
	disableStartVoteButton: boolean;
	onClickStartVoteButton: () => void;
}

function StartVoteOrSendDrawing(props: StartVoteOrSendDrawingProps): JSX.Element {
	const { t } = useTranslation();

	return (
		<div style={{ height: '100%', paddingTop: '12px' }}>
			{(props.showDrawingButton ? (
				<Button
					color='primary'
					size='medium'
					fullHeight
					fullWidth
					icon={faArrowRight}
					disabled={props.disableDrawingButton}
					onClick={props.onClickDrawingButton}>
					{t('gameView.sendDrawing')}
				</Button>
			) : (
				<Button
					color='primary'
					size='medium'
					fullHeight
					fullWidth
					icon={faArrowRight}
					disabled={props.disableStartVoteButton}
					onClick={props.onClickStartVoteButton}>
					{t('gameView.startVote')}
				</Button>
			))}
		</div>
	)
}
