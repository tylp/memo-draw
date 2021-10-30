import React, { useEffect, useState } from 'react';
import { useSocketLobby } from '../../hooks';
import useLocalStorage from '../../hooks/useLocalStorage/useLocalStorage';
import LobbyType from '../../../server/classes/Lobby/Lobby';
import { Game } from '../../../server/classes';
import { LobbyView, GameView } from '../../components/Lobby';
import { LocalStorageKey } from '../../hooks/useLocalStorage/useLocalStorage.types';
import { useDangerSnackbar, useInfoSnackbar } from '../../hooks/useSnackbar/useSnackbar';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoadingFull } from '../../components/Common';

const Lobby = (): JSX.Element => {
	const [sessionId] = useLocalStorage(LocalStorageKey.SessionId);
	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);
	const history = useHistory();
	const { t } = useTranslation();

	const [[infoSnackbar], [dangerSnackbar]] = [useInfoSnackbar(), useDangerSnackbar()]

	const socket = useSocketLobby();
	const [lobby, setLobby] = useState<LobbyType>();
	const [game, setGame] = useState<Game>();

	useEffect(() => {
		if (!socket) return;

		socket.emit('join-lobby', (joinedLobby: LobbyType) => {
			if (!joinedLobby) {
				dangerSnackbar(t('alert.haventJoinedLobbyYet'))
				history.push('/')
			} else {
				setLobby(joinedLobby);
				setGame(joinedLobby?.game);
			}
		})

		socket.on('update-lobby', (updatedLobby: LobbyType) => {
			setLobby(updatedLobby);
			setGame(updatedLobby?.game);
		})

		socket.on('kicked-player', (kickedPlayerId) => {
			if (kickedPlayerId === playerId) {
				infoSnackbar(t('alert.youGotKicked'))
				history.push('/')
			}
		})

		socket.on('game-started', (lobby) => {
			setLobby(lobby);
			setGame(lobby.game);
		})

		socket.on('update-game', (game) => {
			setGame(game);
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, sessionId]);

	return lobby ? (
		<LobbyOrGame lobby={lobby} game={game}></LobbyOrGame>
	) : (
		<LoadingFull></LoadingFull>
	)
}
export default Lobby;

function LobbyOrGame(props: { lobby: LobbyType; game: Game }) {
	return props.lobby?.hasStarted && props.game ? (
		<GameView game={props.game} />
	) : (
		<LobbyView lobby={props.lobby} />
	)
}