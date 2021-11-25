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
import { Box, Button, Layout, Modal, SectionTitle } from '../../../Common'
import UserEtiquette from '../../UserEtiquette/UserEtiquette';
import Canvas from './Canvas/Canvas';
import BottomToolBox from './Canvas/Toolbox/BottomToolBox';
import { EngineContextProvider } from './Canvas/Toolbox/EngineContext';
import RightToolBox from './Canvas/Toolbox/RightToolBox';
import Countdown from './Countdown/Countdown';
import PlayerSelector from './PlayerSelector/PlayerSelector'

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

	const nextDrawing = () => {
		if (playerId === props.currentPlayer.id) {
			SocketEventEmitter.nextDrawing(props.socket);
		}
	}

	const startVote = () => {
		if (playerId !== props.currentPlayer.id && selectedPlayer) {
			SocketEventEmitter.startVote(props.socket, selectedPlayer);
			setIsStartVoteModalVisible(false);
		}
	}

	const vote = (vote: YesOrNo) => {
		setCurrentVote(vote);
		SocketEventEmitter.vote(props.socket, vote);
	}

	const getPillTitleDrawing = (player: Player): undefined | string => {
		return (player.id === props.currentPlayer.id) ? t('gameView.currentlyDrawing') : undefined;
	}

	const getPillTitleItsYou = (player: Player): undefined | string => {
		return (player.id === playerId) ? t('gameView.itsYouLabel') : undefined;
	}

	const hasPlayerLost = (player: Player): boolean => {
		return props.lobby.game.losers.map(e => e.id).includes(player.id)
	}

	return (
		<Layout>
			<Modal
				visible={isStartVoteModalVisible}
				onClose={() => setIsStartVoteModalVisible(false)}
				onValidate={startVote}
				disableValidate={!selectedPlayer}
				title={t('gameView.startVote')}
			>
				<Box mb={2} className={'w-full'}>
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
						<Box mb={2}>
							{
								props.lobby.game?.playerErrorVoteManager?.selectedPlayer && (
									<UserEtiquette player={props.lobby.game.playerErrorVoteManager.selectedPlayer} color="secondary"></UserEtiquette>
								)
							}
						</Box>
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
			<EngineContextProvider engine={props.engine}>
				<div className='flex flex-row justify-center'>
					<div className='flex flex-col flex-1 w-52'>
						<div className='h-16'>
							<SectionTitle hintColor="text-yellow-light-yellow">{t('gameView.playersTitle')}</SectionTitle>
						</div>
						<div>
							{
								props.lobby.game?.players.map((player: Player) => (
									<Box mb={2} key={player.id} >
										<UserEtiquette player={player} color='secondary' disabled={hasPlayerLost(player)} rPillTitle={getPillTitleItsYou(player)} brPillTitle={getPillTitleDrawing(player)} />
									</Box>
								))
							}
						</div>
						{
							props.spectators.length > 0 && <Spectators spectators={props.spectators} playerId={playerId} />
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
							<Canvas engine={props.engine} setEngine={props.setEngine} />
						</div>
						<div className='bg-blue-darker-blue rounded-md mt-4 text-lg font-semibold text-white-white text-center'>
							<BottomToolBox />
						</div>
					</div>
					<div className='flex flex-col justify-between flex-1 w-52'>
						<div className='h-12'>
							{
								(hasLost) && (
									<Button
										color='primary'
										size='medium'
										fullHeight
										fullWidth
										icon={faArrowRight}
										disabled={!(hasLost || props.spectators.map(e => e.id).includes(playerId))}
										onClick={props.leaveGame}>
										{t('lobbyView.leaveBtnLabel')}
									</Button>
								)
							}
						</div>
						<div className='bg-blue-darker-blue rounded-md flex-grow text-lg font-semibold text-white-white text-center mt-4 mb-4'>
							<RightToolBox />
						</div>
						<div className='h-20'>
							<StartVoteOrSendDrawing
								showDrawingButton={playerId === props.currentPlayer.id}
								disableDrawingButton={hasLost}
								onClickDrawingButton={nextDrawing}
								disableStartVoteButton={hasLost || !props.lobby.game.players.map(e => e.id).includes(playerId)}
								onClickStartVoteButton={() => setIsStartVoteModalVisible(true)}
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

	return props.showDrawingButton ? (
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
	)
}


interface SpectatorsProps {
	spectators: Player[];
	playerId: string;
}

function Spectators(props: SpectatorsProps): JSX.Element {
	const { t } = useTranslation();

	const getPillTitleItsYou = (player: Player): undefined | string => {
		return (player.id === props.playerId) ? t('gameView.itsYouLabel') : undefined;
	}

	return (
		<>
			<div className='h-16'>
				<SectionTitle hintColor="text-yellow-light-yellow">{t('gameView.spectatorsTitle')}</SectionTitle>
			</div>
			<div>
				{
					props.spectators.map((player: Player) => (
						<Box mb={2} key={player.id} >
							<UserEtiquette player={player} color='light-secondary' rPillTitle={getPillTitleItsYou(player)} />
						</Box>
					))
				}
			</div>
		</>
	)
}