import React from 'react';
import Player from '../../../../server/classes/Player';
import Room from '../../../../server/classes/Room';
import { useSocketRoom } from '../../../hooks';
import useLocalStorage from '../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../hooks/useLocalStorage/useLocalStorage.types';
import { EnvironmentChecker } from '../../../services/EnvironmentChecker';
import { Layout, SectionTitle } from '../../Common';
import Button from '../../Common/Button/Button';
import UserCard from './UserCard';
import { faChevronLeft, faChevronRight, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faLink, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Divider from '../../Common/Divider/Divider';
import { useTranslation } from 'react-i18next';
import { useSuccessSnackbar } from '../../../hooks/useSnackbar/useSnackbar';

import { useHistory } from 'react-router-dom'

export interface LobbyViewProps {
	room: Room;
}

export function LobbyView(props: LobbyViewProps): JSX.Element {
	const socket = useSocketRoom();
	const { t } = useTranslation();

	const history = useHistory();

	const [openSnackbar] = useSuccessSnackbar()

	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);

	const copyLinkToClipboard = () => {
		if (EnvironmentChecker.isClientSide()) {
			navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/join/${props.room.id}`);
			openSnackbar(t('snackbar.successfullyCopied'))
		}
	}

	const startGame = () => {
		if (props.room.creatorPlayerId === playerId) {
			socket.emit('start-game');
		}
	}

	const quitGame = () => {
		history.push('/');
		socket.emit('quit-game');
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
						{t('lobbyView.invite')}
					</Button>
					<Button className='self-center' color='secondary' size='small'
						onClick={quitGame}
						icon={faTimes}>
						{t('lobbyView.leave')}
					</Button>
				</div>
				<div className="flex flex-row items-center">
					<FontAwesomeIcon className="text-white-white opacity-25" size="4x" icon={faChevronLeft} />
					{
						props.room?.players.map((player: Player) => (
							<UserCard key={player.id} player={player} currentPlayerId={playerId} creatorId={props.room?.creatorPlayerId} />
						))
					}
					<FontAwesomeIcon className="text-white-white opacity-25" size="4x" icon={faChevronRight} />
				</div>
				<div className="flex flex-row align-middle">
					<SectionTitle width='w-36' hintColor="text-pink-dark-pink">{t('lobbyView.gameTitle')}</SectionTitle>
					<Divider />
					{
						props.room.creatorPlayerId === playerId && (
							<Button
							className='self-center' color='primary' size='small' onClick={startGame}
							icon={faPlay}>
								{t('lobbyView.start')}
							</Button>
						)
					}
					<div className="self-center pl-3 pr-3 m-0 h-5 rounded-xl bg-pink-dark-pink text-sm font-rubik-bold text-white-white whitespace-nowrap">{props.room?.players.length} / 10</div>
				</div>
			</div>
		</Layout>
	)
}