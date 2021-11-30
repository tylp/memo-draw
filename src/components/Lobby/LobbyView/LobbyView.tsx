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

interface LobbyViewProps {
	lobby: Lobby;
	leaveGame: () => void;
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

	const [isProfileValid, setIsProfileValid] = useState(false);

	const [gameMode, setGameMode] = useState(GameModeProperty.Classic);

	useEffect(() => {
		setProfile(localStorageProfile);
	}, [localStorageProfile])

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
			<div className="flex flex-col justify-center">
				<div className="flex flex-row justify-center align-middle">
					<Box mt={6} mb={6}>
						<SectionTitle hintColor="text-yellow-light-yellow">{t('lobbyView.playersTitle')}</SectionTitle>
					</Box>
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
							onClick={props.leaveGame}
							icon={faTimes}>
							{t('lobbyView.leaveBtnLabel')}
						</Button>
					</Box>
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
				<div className="flex flex-row align-middle">
					<Box mt={6} mb={6}>
						<SectionTitle hintColor="text-pink-dark-pink">{t('lobbyView.gameTitle')}</SectionTitle>
					</Box>
					<Divider />
					<div className="self-center pl-3 pr-3 m-0 h-5 rounded-xl bg-pink-dark-pink text-sm font-rubik-bold text-white-white whitespace-nowrap">{props.lobby?.players.length} / 10</div>
					{
						props.lobby.hostPlayerId === playerId && (
							<Box className="self-center" ml={2}>
								<Button
									color='primary' size='small' onClick={startGame}
									icon={faPlay}
								>
									{t('lobbyView.startBtnLabel')}
								</Button>
							</Box>
						)
					}
				</div>
				<Row>
					{
						gameModePropertiesValues.map(gameModeProperty =>
							<Col xs={12} sm={6} lg={4} key={gameModeProperty}>
								<GameSetting
									title={t(`gamemodes.${gameModeProperty}.title`)}
									description={t(`gamemodes.${gameModeProperty}.description`)}
									currentValue={gameMode}
									value={gameModeProperty}
									icon={faStopwatch}
									setCurrentValue={setGameMode} />
							</Col>,
						)
					}
				</Row>
			</div>
		</Layout >
	)
}