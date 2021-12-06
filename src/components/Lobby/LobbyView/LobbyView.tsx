import React, { useEffect, useState } from 'react';
import Player from '../../../../server/classes/Player';
import { Lobby } from '../../../../server/classes';
import { useSocketLobby } from '../../../hooks';
import useLocalStorage from '../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../hooks/useLocalStorage/useLocalStorage.types';
import { EnvironmentChecker } from '../../../services/EnvironmentChecker';
import { Divider, Layout, SectionTitle, Button, ProfileSelector } from '../../../components/Common';
import UserCard from './UserCard';
import { faEdit, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faLink, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { GameSetting } from './GameSetting/GameSetting';
import { GameModeProperty } from '../../../../server/enums/GameProperties';

import { faStopwatch } from '@fortawesome/free-solid-svg-icons';

import Modal from '../../Common/Modal/Modal';
import IProfile from '../../../../server/interfaces/IProfile';
import ProfileFactory from '../../../../server/factories/ProfileFactory';
import Carousel from '../../Common/Carousel/Carousel';
import Box from '../../Common/Box/Box';
import { Col, Row } from 'react-grid-system';
import SocketEventEmitter from '../../../services/SocketEventEmitter';
import { useSuccessSnackbar, useWarningSnackbar } from '../../../hooks/useSnackbar/useSnackbar';
import ProfileValidatorService from 'server/services/ProfileValidatorService';
import { Socket } from 'socket.io-client';

interface LobbyViewProps {
	lobby: Lobby;
	leaveGame: () => void;
	socket: Socket;
}

export default function LobbyView(props: LobbyViewProps): JSX.Element {
	const socket = useSocketLobby();
	const { t } = useTranslation();

	const [openSuccessSnackbar] = useSuccessSnackbar()
	const [openWarningSnackBar] = useWarningSnackbar()

	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);
	const [localStorageProfile, setLocalStorageProfile] = useLocalStorage<IProfile>(LocalStorageKey.Profile);

	const [profile, setProfile] = useState<IProfile>(ProfileFactory.create());
	const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
	const [isCantStartGameAloneModalVisible, setIsCantStartGameAloneModalVisible] = useState(false);
	const [isProfileValid, setIsProfileValid] = useState(false);

	const [gameMode, setGameMode] = useState(GameModeProperty.Classic);

	useEffect(() => {
		props.socket.on('update-game-mode', (newGameMode: GameModeProperty) => {
			setGameMode(newGameMode)
		})
	}, [props.socket])

	useEffect(() => {
		if (localStorageProfile && ProfileValidatorService.validate(localStorageProfile)) {
			setProfile(localStorageProfile);
		} else {
			const newProfile = ProfileFactory.create();
			setProfile(newProfile)
			setLocalStorageProfile(newProfile);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [localStorageProfile])

	const gameModeSettingOnClick = (gameMode: GameModeProperty) => {
		if (props.lobby.hostPlayerId === playerId) {
			SocketEventEmitter.updateGameMode(props.socket, gameMode)
		}
	};

	const handleSaveProfile = () => {
		if (isProfileValid) {
			SocketEventEmitter.updateProfile(socket, profile, () => {
				setLocalStorageProfile(profile);
				setIsEditProfileVisible(false)
			})
		} else {
			openWarningSnackBar(t('alert.lengthError'));
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const enumToArray = (T: any): typeof T[] => {
		return Object.values(T)
			.filter((value) => typeof value === 'number')
			.map((value) => value as typeof T)
	}

	const gameModePropertiesValues: GameModeProperty[] = enumToArray(GameModeProperty)

	const copyLinkToClipboard = () => {
		if (EnvironmentChecker.isClientSide()) {
			navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/join/${props.lobby.id}`);
			openSuccessSnackbar(t('lobbyView.successfullyCopied'))
		}
	}

	const tryToStartGame = () => {
		if (props.lobby.players.length > 1 || process.env.NODE_ENV === 'development') {
			startGame();
		} else {
			setIsCantStartGameAloneModalVisible(true);
		}
	}

	const startGame = () => {
		if (props.lobby.hostPlayerId === playerId) {
			SocketEventEmitter.startGame(socket, gameMode);
		}
	}

	return (
		<Layout>
			<Modal
				visible={isEditProfileVisible}
				onClose={() => setIsEditProfileVisible(false)}
				onValidate={handleSaveProfile}
				disableValidate={!isProfileValid}
				title={t('lobbyView.editProfileBtnLabel')}
			>
				<p className="my-4 text-blueGray-500 text-lg leading-relaxed">
					<ProfileSelector profile={profile} setProfile={setProfile} setIsProfileValid={setIsProfileValid} onEnter={handleSaveProfile}></ProfileSelector>
				</p>
			</Modal>
			<Modal
				visible={isCantStartGameAloneModalVisible}
				onValidate={() => setIsCantStartGameAloneModalVisible(false)}
				showCancel={false}
				title={t('lobbyView.cantStartGameAlone')}
			>
			</Modal>
			<div className="flex flex-col justify-center">
				<div className="my-6 flex flex-col md:flex-row justify-center md:items-center items:start flex-wrap">
					<div className="mb-4 md:mb-0">
						<SectionTitle hintColor="text-yellow-light-yellow">{t('lobbyView.playersTitle')}</SectionTitle>
					</div>
					<Divider />
					<div className="w-full md:w-auto mb-2 md:mb-0 mr-0 md:mr-2">
						<Button
							fullWidth
							color="secondary"
							size="small"
							onClick={copyLinkToClipboard}
							icon={faLink}>
							{t('lobbyView.inviteBtnLabel')}
						</Button>
					</div>
					<div className="w-full md:w-auto mb-2 md:mb-0 mr-0 md:mr-2">
						<Button
							fullWidth
							color="secondary"
							size="small"
							onClick={() => setIsEditProfileVisible(true)}
							icon={faEdit}>
							{t('lobbyView.editProfileBtnLabel')}
						</Button>
					</div>
					<div className="w-full md:w-auto">
						<Button
							fullWidth
							color="secondary"
							size="small"
							onClick={props.leaveGame}
							icon={faTimes}>
							{t('lobbyView.leaveBtnLabel')}
						</Button>
					</div>
				</div>
				<div className="flex flex-row items-center">
					<Carousel>
						{props.lobby?.players.map((player: Player) => (
							<Box key={player.id}>
								<UserCard player={player} currentPlayerId={playerId} creatorId={props.lobby?.hostPlayerId} />
							</Box>
						))}
					</Carousel>
				</div>
				<div className="mt-6 mb-8 flex flex-row align-middle justify-between">
					<SectionTitle hintColor="text-pink-dark-pink">{t('lobbyView.gameTitle')}</SectionTitle>
					<Divider />
					<div className="self-center px-3 py-2 leading-none rounded-xl bg-pink-dark-pink text-sm font-rubik-bold text-white-white whitespace-nowrap">
						{props.lobby?.players.length} / 10
					</div>
					{props.lobby.hostPlayerId === playerId && (
						<Box className="self-center" ml={2}>
							<Button
								color="primary"
								size="small"
								onClick={tryToStartGame}
								icon={faPlay}>
								{t('lobbyView.startBtnLabel')}
							</Button>
						</Box>
					)}
				</div>
				<Row>
					{gameModePropertiesValues.map(gameModeProperty =>
						<Col xs={12} sm={6} lg={4} key={gameModeProperty}>
							<GameSetting
								title={t(`gamemodes.${gameModeProperty}.title`)}
								description={t(`gamemodes.${gameModeProperty}.description`)}
								currentValue={gameMode}
								value={gameModeProperty}
								icon={faStopwatch}
								setCurrentValue={setGameMode}
								disabled={props.lobby.hostPlayerId !== playerId}
								onClick={gameModeSettingOnClick} />
						</Col>,
					)}
				</Row>
			</div>
		</Layout >
	)
}