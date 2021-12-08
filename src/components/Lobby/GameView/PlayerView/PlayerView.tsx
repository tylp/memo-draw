import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { Engine } from 'memo-draw-engine';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Socket } from 'socket.io-client';
import { Lobby, Player } from '../../../../../server/classes';
import { YesOrNo } from '../../../../../server/classes/Votes/YesNoVote';
import useLocalStorage from '../../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../../hooks/useLocalStorage/useLocalStorage.types';
import SocketEventEmitter from '../../../../services/SocketEventEmitter';
import VoteTargets from '../../../../services/VoteTargets/VoteTargets';
import { Box, Button, Layout, SectionTitle } from '../../../Common'
import BottomToolBox from '../Canvas/Toolbox/BottomToolBox';
import { EngineContextProvider } from '../Canvas/Toolbox/EngineContext';
import RightToolBox from '../Canvas/Toolbox/RightToolBox';
import PlayersAndSpectators from '../PlayersAndSpectators/PlayersAndSpectators';
import Countdown from './Countdown/Countdown';

import styles from '../../../../../styles/GameView.module.css';
import Canvas from '../Canvas/Canvas';
import CurrentVote from './CurrentVote/CurrentVote';

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
			props.updateLobby(lobby);
		})

		props.socket.on('stop-vote', () => {
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

	const startVote = (player: Player) => {
		if (playerId !== player.id && getVoteTargets().includes(player)) {
			setCurrentVote('yes');
			SocketEventEmitter.startVote(props.socket, player);
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
			<EngineContextProvider engine={props.engine}>
				<div style={{ userSelect: 'none' }} className={`mt-6 ${styles['grid-3']}`}>
					<div className={`${styles['col-gap']} ${styles['player-overflow']}`}>
						<div style={{ direction: 'ltr' }}>
							<Box mb={2}>
								{
									((props.lobby?.game?.playerErrorVoteManager?.selectedPlayer?.id !== playerId) && props.lobby?.game?.playerErrorVoteManager?.currentVote) && (!props.lobby?.game?.playerErrorVoteManager?.currentVote?.isClosed) && (
										<>
											<div className="h-16">
												<SectionTitle hintColor="text-yellow-light-yellow">
													{t('gameView.voting')}
												</SectionTitle>
											</div>
											<p className="text-white-white">{t('gameView.hasThisPlayerMadeAnError')}</p>
											<CurrentVote vote={vote} currentVote={currentVote} currentVoteManager={props.lobby?.game?.playerErrorVoteManager} />
										</>
									)
								}
							</Box>
						</div>
						<div style={{ direction: 'ltr' }}>
							<PlayersAndSpectators
								players={props.lobby.game?.players}
								spectators={props.spectators}
								losers={props.lobby.game.losers}
								playerId={playerId}
								currentPlayer={props.currentPlayer}
								startVote={startVote}
							/>
						</div>
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
										color="primary"
										size="medium"
										fullHeight fullWidth
										icon={faArrowRight}
										disabled={!(hasLost || props.spectators.map(e => e.id).includes(playerId))}
										onClick={props.leaveGame}>
										{t('lobbyView.leaveBtnLabel')}
									</Button>
								</div>
							)}
							<div style={{ height: '100%', paddingTop: '12px' }}>
								<Button
									color="primary"
									size="medium"
									fullHeight
									fullWidth
									icon={faArrowRight}
									disabled={!(props.lobby.game.currentPlayer.id === playerId) || hasLost || !props.lobby.game.players.map(e => e.id).includes(playerId)}
									onClick={nextDrawing}>
									{t('gameView.sendDrawing')}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</EngineContextProvider>
		</Layout>
	)
}
