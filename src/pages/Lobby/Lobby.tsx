import React, { useEffect, useState } from 'react';
import { useSocketLobby } from '../../hooks';
import useLocalStorage from '../../hooks/useLocalStorage/useLocalStorage';
import LobbyType from '../../../server/classes/Lobby';
import { Game } from '../../../server/classes/Game';
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
	const [room, setLobby] = useState<LobbyType>();
	const [game, setGame] = useState<Game>();

	useEffect(() => {
		if (!socket) return;

		socket.emit('join-lobby', (data) => {
			if (!data) {
				dangerSnackbar(t('alert.haventJoinedLobbyYet'))
				history.push('/')
			} else {
				setLobby(data);
			}
		})

		socket.on('update-lobby', (data) => {
			setLobby(data);
		})

		socket.on('kicked-player', (kickedPlayerId) => {
			if (kickedPlayerId === playerId) {
				infoSnackbar(t('alert.youGotKicked'))
				history.push('/')
			}
		})

		socket.on('game-started', (room) => {
			setLobby(room);
			setGame(room.game);
		})

		socket.on('update-game', (game) => {
			setGame(game);
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, sessionId]);

	return room ? (
		<LobbyOrGame room={room} game={game}></LobbyOrGame>
	) : (
		<LoadingFull></LoadingFull>
	)
}
export default Lobby;

function LobbyOrGame(props: { room: LobbyType; game: Game }) {
	return props.room?.hasStarted && props.game ? (
		<GameView game={props.game} />
	) : (
		<LobbyView room={props.room} />
	)
}