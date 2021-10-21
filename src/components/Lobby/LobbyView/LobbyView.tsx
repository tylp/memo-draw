import React, { useState } from 'react';
import Player from '../../../../server/classes/Player';
import Room from '../../../../server/classes/Room';
import { useSocketRoom } from '../../../hooks';
import useLocalStorage from '../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../hooks/useLocalStorage/useLocalStorage.types';
import { EnvironmentChecker } from '../../../services/EnvironmentChecker';
import { Divider, Layout, SectionTitle, Button } from '../../../components/Common';
import UserCard from './UserCard';
import { faChevronLeft, faChevronRight, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faLink, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useSuccessSnackbar, useWarningSnackbar } from '../../../hooks/useSnackbar/useSnackbar';
import { GameSetting } from './GameSetting/GameSetting';
import { SpeedProperties, GameModeProperties } from '../../../../server/enums/GameProperties';

import { useHistory } from 'react-router-dom'

interface LobbyViewProps {
	room: Room;
}

export default function LobbyView(props: LobbyViewProps): JSX.Element {
	const socket = useSocketRoom();
	const { t } = useTranslation();

	const history = useHistory();

	const [openSuccessSnackbar] = useSuccessSnackbar()

	const [openInfoSnackBar] = useWarningSnackbar()

	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);

    const [gameSpeed, setGameSpeed] = useState(SpeedProperties.Normal);
    const [gameMode, setGameMode] = useState(GameModeProperties.Classic);

	const speedPropertiesValues: SpeedProperties[] = Object.values(SpeedProperties)
		.filter((value) => typeof value === 'number')
		.map((value) => value as SpeedProperties);

	const gameModePropertiesValues: GameModeProperties[] = Object.values(GameModeProperties)
		.filter((value) => typeof value === 'number')
		.map((value) => value as GameModeProperties);

	const copyLinkToClipboard = () => {
		if (EnvironmentChecker.isClientSide()) {
			navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/join/${props.room.id}`);
			openSuccessSnackbar(t('lobbyView.successfullyCopied'))
		}
	}

	const startGame = () => {
		if (props.room.hostPlayerId === playerId) {
			socket.emit('start-game');
		}
	}

	const leaveGame = () => {
		openInfoSnackBar(t('alert.leavedLobby'))
		history.push('/');
		socket.emit('leave-game');
		socket.emit('reset-linked-room');
	}

	return (
		<Layout>
			<div className="flex flex-col justify-center">
				<div className="flex flex-row justify-center align-middle">
					<SectionTitle width='w-36' hintColor="text-yellow-light-yellow">{t('lobbyView.playersTitle')}</SectionTitle>
					<Divider />
					<Button className='self-center' color='secondary' size='small'
						onClick={copyLinkToClipboard}
						icon={faLink}>
						{t('lobbyView.inviteBtnLabel')}
					</Button>
					<Button className='self-center' color='secondary' size='small'
						onClick={leaveGame}
						icon={faTimes}>
						{t('lobbyView.leaveBtnLabel')}
					</Button>
				</div>
				<div className="flex flex-row items-center">
					<FontAwesomeIcon className="text-white-white opacity-25" size="4x" icon={faChevronLeft} />
					{
						props.room?.players.map((player: Player) => (
							<UserCard key={player.id} player={player} currentPlayerId={playerId} creatorId={props.room?.hostPlayerId} />
						))
					}
					<FontAwesomeIcon className="text-white-white opacity-25" size="4x" icon={faChevronRight} />
				</div>
				<div className="flex flex-row align-middle">
					<SectionTitle width='w-36' hintColor="text-pink-dark-pink">{t('lobbyView.gameTitle')}</SectionTitle>
					<Divider />
					{
						props.room.hostPlayerId === playerId && (
							<Button
								className='self-center' color='primary' size='small' onClick={startGame}
								icon={faPlay}>
								{t('lobbyView.startBtnLabel')}
							</Button>
						)
					}
					<div className="self-center pl-3 pr-3 m-0 h-5 rounded-xl bg-pink-dark-pink text-sm font-rubik-bold text-white-white whitespace-nowrap">{props.room?.players.length} / 10</div>
				</div>
				<div className="flex flex-row justify-start flex-wrap">
					<GameSetting<SpeedProperties> title="speed" name="speeds" list={speedPropertiesValues} currentValue={gameSpeed} setCurrentValue={setGameSpeed}/>
					<GameSetting<GameModeProperties> title="game" name="gameModes" list={gameModePropertiesValues} currentValue={gameMode} setCurrentValue={setGameMode}/>
				</div>
			</div>
		</Layout>
	)
}