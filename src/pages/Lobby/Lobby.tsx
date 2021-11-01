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
import { Socket } from 'socket.io-client';

const Lobby = (): JSX.Element => {
	const [sessionId] = useLocalStorage(LocalStorageKey.SessionId);
	const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);
	const history = useHistory();
	const { t } = useTranslation();

	const [[infoSnackbar], [dangerSnackbar]] = [useInfoSnackbar(), useDangerSnackbar()]

	const socket = useSocketLobby();
	const [lobby, setLobby] = useState<LobbyType>();
	const [game, setGame] = useState<Game>();

	const updateLobby = (lobby: LobbyType) => {
		setLobby(lobby);
		setGame(lobby?.game);
	}

	useEffect(() => {
		if (!socket) return;

		socket.emit('join-lobby', (joinedLobby: LobbyType) => {
			if (!joinedLobby) {
				dangerSnackbar(t('alert.haventJoinedLobbyYet'))
				history.push('/')
			} else {
				updateLobby(joinedLobby)
			}
		})

		socket.on('update-lobby', (updatedLobby: LobbyType) => {
			updateLobby(updatedLobby)
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
		<LobbyOrGame lobby={lobby} game={game} updateLobby={updateLobby} socket={socket}></LobbyOrGame>
	) : (
		<LoadingFull></LoadingFull>
	)
}
export default Lobby;

interface LobbyOrGameProps {
	lobby: LobbyType;
	game: Game, updateLobby: (lobby: LobbyType) => void;
	socket: typeof Socket
}

function LobbyOrGame(props: LobbyOrGameProps) {
	return props.lobby?.hasStarted && props.game ? (
		<GameView game={props.game} updateLobby={props.updateLobby} socket={props.socket} />
	) : (
		<LobbyView lobby={props.lobby} />
	)
}