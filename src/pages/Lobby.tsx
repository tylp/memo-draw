import React, { useEffect, useState } from 'react';
import { useSocketRoom } from '../hooks';
import useLocalStorage from '../hooks/useLocalStorage/useLocalStorage';
import RoomType from '../../server/classes/Room';
import { Game } from '../../server/classes/Game';
import { LobbyView } from '../components/Room/LobbyView/LobbyView';
import { GameView } from '../components/Room/GameView/GameView';
import { LocalStorageKey } from '../hooks/useLocalStorage/useLocalStorage.types';
import { useDangerSnackbar } from '../hooks/useSnackbar/useSnackbar';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoadingFull } from '../components/Common';

const Lobby = (): JSX.Element => {
	const [sessionId] = useLocalStorage(LocalStorageKey.SessionId);
	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);
	const history = useHistory();
	const { t } = useTranslation();

	const [openSnackbar] = useDangerSnackbar()

	const socket = useSocketRoom();
	const [room, setRoom] = useState<RoomType>();
	const [game, setGame] = useState<Game>();

	useEffect(() => {
		if (!socket) return;

		socket.emit('join-room', (data) => {
			if (data === false) {
				openSnackbar(t('snackbar.haventJoinedRoomYet'))
				history.push('/')
			} else {
				setRoom(data);
			}
		})

		socket.on('update-room', (data) => {
			setRoom(data);
		})

		socket.on('kicked-player', (kickedPlayerId) => {
			if (kickedPlayerId === playerId) {
				socket.emit('reset-linked-room')
				openSnackbar('snackbar.youGotKicked')
				history.push('/')
			}
		})

		socket.on('game-started', (room, game) => {
			setRoom(room);
			setGame(game);
		})

		socket.on('update-game', (game) => {
			setGame(game);
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, sessionId]);

	return room ? (
		<RoomOrGame room={room} game={game}></RoomOrGame>
	) : (
		<LoadingFull></LoadingFull>
	)
}
export default Lobby;

function RoomOrGame(props: { room: RoomType; game: Game }) {
	return props.room?.hasStarted && props.game ? (
		<GameView game={props.game} />
	) : (
		<LobbyView room={props.room} />
	)
}