import React, { useEffect, useState } from 'react';
import { useSocketRoom } from '../hooks';
import { Layout, Title } from '../components/Common';
import Button from '../components/Common/Button/Button';
import Loading from '../components/Common/Loading/Loading';
import useLocalStorage from '../hooks/useLocalStorage/useLocalStorage';
import RoomType from '../../server/classes/Room';
import { Game } from '../../server/classes/Game';
import { LobbyView } from '../components/Room/LobbyView/LobbyView';
import { GameView } from '../components/Room/GameView/GameView';
import { LocalStorageKey } from '../hooks/useLocalStorage/useLocalStorage.types';
import { useDangerSnackbar } from '../hooks/useSnackbar/useSnackbar';
import { useHistory } from 'react-router-dom';

const Lobby = (): JSX.Element => {
	const [isLoading, setIsLoading] = useState(true);
	const [sessionId] = useLocalStorage(LocalStorageKey.SessionId);
	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);
	const history = useHistory();

	const [openSnackbar] = useDangerSnackbar()

	const socket = useSocketRoom();
	const [room, setRoom] = useState<RoomType>();
	const [game, setGame] = useState<Game>();

	useEffect(() => {
		if (!socket) return;

		socket.emit('join-room', (data) => {
			if (data === false) {
				openSnackbar('You haven\'t joined a room yet.')
				history.push('/')
			} else {
				setIsLoading(false)
				setRoom(data);
			}
		})

		socket.on('update-room', (data) => {
			setRoom(data);
		})

		socket.on('kicked-player', (kickedPlayerId) => {
			if (kickedPlayerId === playerId) {
				socket.emit('reset-linked-room')
				openSnackbar('You got kicked.')
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

	return isLoading ? (
		<Loading />
	)
		:
		room ? (
			<RoomOrGame room={room} game={game}></RoomOrGame>
		)
			: (
				<Layout>
					<Title>Ce salon n`&apos;`existe pas, veuillez reessayer: </Title>
					<Button><a href="/">Créer un salon / rejoindre un salon</a></Button>
				</Layout>
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