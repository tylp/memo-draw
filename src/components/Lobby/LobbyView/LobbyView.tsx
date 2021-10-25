import React, { useEffect, useState } from 'react';
import Player from '../../../../server/classes/Player';
import Room from '../../../../server/classes/Room';
import { useSocketRoom } from '../../../hooks';
import useLocalStorage from '../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../hooks/useLocalStorage/useLocalStorage.types';
import { EnvironmentChecker } from '../../../services/EnvironmentChecker';
import { Divider, Layout, SectionTitle, Button, ProfileSelector } from '../../../components/Common';
import UserCard from './UserCard';
import { faEdit, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faLink, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { GameSetting } from './GameSetting/GameSetting';
import { SpeedProperties, GameModeProperties } from '../../../../server/enums/GameProperties';

import { useHistory } from 'react-router-dom'
import { IRadioNode } from '../../../../server/interfaces/IRadioNode';
import { useInfoSnackbar, useSuccessSnackbar } from '../../../hooks/useSnackbar/useSnackbar';

import Modal from '../../Common/Modal/Modal';
import IProfile from '../../../../server/interfaces/IProfile';
import ProfileFactory from '../../../../server/factories/ProfileFactory';
import Carousel from '../../Common/Carousel/Carousel';
import Box from '../../Common/Box/Box';

interface LobbyViewProps {
	room: Room;
}

export default function LobbyView(props: LobbyViewProps): JSX.Element {
	const socket = useSocketRoom();
	const { t } = useTranslation();

	const history = useHistory();

	const [openSuccessSnackbar] = useSuccessSnackbar()
	const [openInfoSnackBar] = useInfoSnackbar()

	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);
	const [localStorageProfile, setLocalStorageProfile] = useLocalStorage<IProfile>(LocalStorageKey.Profile);

	const [profile, setProfile] = useState<IProfile>(ProfileFactory.create());
	const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);

	useEffect(() => {
		setProfile(localStorageProfile);
	}, [localStorageProfile])

	const handleSaveProfile = () => {
		socket.emit('update-profile', profile, () => {
			setLocalStorageProfile(profile);
			setIsEditProfileVisible(false)
		})
	}

	const [gameSpeed, setGameSpeed] = useState(SpeedProperties.Normal);
	const [gameMode, setGameMode] = useState(GameModeProperties.Classic);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const enumToArray = (T: any, translationKey: string): IRadioNode[] => {
		return Object.values(T)
			.filter((value) => typeof value === 'number')
			.map((value) => value as typeof T)
			.map((value) => ({ value, 'content': t(`${translationKey}.${value}`) }));
	}

	const speedPropertiesValues: IRadioNode[] = enumToArray(SpeedProperties, 'speeds');

	const gameModePropertiesValues: IRadioNode[] = enumToArray(GameModeProperties, 'gamemodes')

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
	}

	return (
		<Layout>
			<Modal
				visible={isEditProfileVisible}
				onClose={() => setIsEditProfileVisible(false)}
				onValidate={handleSaveProfile}
			>
				<p className="my-4 text-blueGray-500 text-lg leading-relaxed">
					<ProfileSelector profile={profile} setProfile={setProfile}></ProfileSelector>
				</p>
			</Modal>
			<div className="flex flex-col justify-center">
				<div className="flex flex-row justify-center align-middle">
					<SectionTitle width='w-36' hintColor="text-yellow-light-yellow">{t('lobbyView.playersTitle')}</SectionTitle>
					<Divider />
					<Box mr={2} className="self-center">
						<Button color='secondary' size='small'
							onClick={copyLinkToClipboard}
							icon={faLink}>
							{t('lobbyView.inviteBtnLabel')}
						</Button>
					</Box>
					<Box mr={2} className="self-center">
						<Button color='secondary' size='small'
							onClick={() => setIsEditProfileVisible(true)}
							icon={faEdit}>
							{t('lobbyView.editProfileBtnLabel')}
						</Button>
					</Box>
					<Box className="self-center">
						<Button color='secondary' size='small'
							onClick={leaveGame}
							icon={faTimes}>
							{t('lobbyView.leaveBtnLabel')}
						</Button>
					</Box>
				</div>
				<div className="flex flex-row items-center">
					<Carousel>
						{
							props.room?.players.map((player: Player) => (
								<Box key={player.id} p={2}>
									<UserCard player={player} currentPlayerId={playerId} creatorId={props.room?.hostPlayerId} />
								</Box>
							))
						}
					</Carousel>
				</div>
				<div className="flex flex-row align-middle">
					<SectionTitle width='w-36' hintColor="text-pink-dark-pink">{t('lobbyView.gameTitle')}</SectionTitle>
					<Divider />
					<div className="self-center pl-3 pr-3 m-0 h-5 rounded-xl bg-pink-dark-pink text-sm font-rubik-bold text-white-white whitespace-nowrap">{props.room?.players.length} / 10</div>
					{
						props.room.hostPlayerId === playerId && (
							<Box className="self-center" ml={2}>
								<Button
									color='primary' size='small' onClick={startGame}
									icon={faPlay}>
									{t('lobbyView.startBtnLabel')}
								</Button>
							</Box>
						)
					}
				</div>
				<div className="flex flex-row justify-start flex-wrap">
					<GameSetting translationKey="speed" list={speedPropertiesValues} currentValue={gameSpeed} setCurrentValue={setGameSpeed} />
					<GameSetting translationKey="gamemode" list={gameModePropertiesValues} currentValue={gameMode} setCurrentValue={setGameMode} />
				</div>
			</div>
		</Layout >
	)
}