import React, { useEffect, useState } from 'react';
import { Lobby } from '../../../../server/classes';
import Player from '../../../../server/classes/Player';
import useLocalStorage from '../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../hooks/useLocalStorage/useLocalStorage.types';
import { Socket } from 'socket.io-client';
import { DrawPermission, drawState, Engine, IAction, ShapeType } from 'memo-draw-engine';
import NetworkManager from '../../../services/NetworkManager/NetworkManager';
import _ from 'lodash';
import EndGameScreen from './EndGameScreen/EndGameScreen';
import PlayerView from './PlayerView/PlayerView';
import SpectatorView from './SpectatorView/SpectatorView';

interface GameProps {
	lobby: Lobby;
	updateLobby: (lobby: Lobby) => void;
	leaveGame: () => void;
	socket: Socket;
}

export default function GameView(props: GameProps): JSX.Element {
	const [playerId] = useLocalStorage<string>(LocalStorageKey.PlayerId);

	const [currentPlayer, setCurrentPlayer] = useState<Player>(props.lobby.game.players[props.lobby.game.currentPlayerIndex])
	const [engine, setEngine] = useState<Engine>();
	const [spectators, setSpectators] = useState<Player[]>([]);

	useEffect(() => {
		if (!engine || !props.socket) return;

		engine.registerNetworkManager(new NetworkManager(props.socket));

		props.socket.on('network-manager-update', (elem: IAction) => {
			engine.networkManager.on(elem);
		})
	}, [engine, props.socket]);

	useEffect(() => {
		if (!engine) return;

		engine.eventManager.registerDefaultCanvasAndDocumentEvents();
		drawState.shapeType = ShapeType.Pencil;
		drawState.drawPermission = DrawPermission.Slave;
		drawState.thickness = 5;

		updateDrawingPermission();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [engine])

	const updateDrawingPermission = () => {
		drawState.drawPermission = currentPlayer?.id === playerId ? DrawPermission.Master : DrawPermission.Slave;
	}

	useEffect(() => {
		updateDrawingPermission();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPlayer])

	useEffect(() => {
		if (props.lobby.game) {
			setCurrentPlayer(props.lobby.game.players[props.lobby.game.currentPlayerIndex])
		}
	}, [props.lobby.game])

	useEffect(() => {
		const idsNotInGame = _.difference(props.lobby.players.map(e => e.id), props.lobby?.game?.players.map(e => e.id));
		setSpectators(props.lobby.players.filter((player: Player) => {
			return idsNotInGame.includes(player.id)
		}));
	}, [props.lobby.players, props.lobby?.game?.players]);

	useEffect(() => {
		if (!props.socket) return;

		props.socket.on('stop-vote', (lobby: Lobby) => {
			props.updateLobby(lobby);
		})

		return () => {
			props.socket.off('stop-vote');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket])

	return (props.lobby?.game?.hasEnded) ? (
		<EndGameScreen
			leaveGame={props.leaveGame}
			socket={props.socket}
			lobby={props.lobby}
		/>
	) : (
		<PlayerViewOrSpectatorView
			lobby={props.lobby}
			socket={props.socket}
			currentPlayer={currentPlayer}
			updateLobby={props.updateLobby}
			leaveGame={props.leaveGame}
			spectators={spectators}
			engine={engine}
			setEngine={setEngine}
		/>
	)
}

interface PlayerViewOrSpectatorViewProps {
	lobby: Lobby;
	socket: Socket;
	currentPlayer: Player;
	updateLobby: (lobby: Lobby) => void;
	leaveGame: () => void;
	spectators: Player[];
	engine: Engine;
	setEngine: React.Dispatch<React.SetStateAction<Engine>>;
}

function PlayerViewOrSpectatorView(props: PlayerViewOrSpectatorViewProps): JSX.Element {
	const [playerId] = useLocalStorage<string>(LocalStorageKey.PlayerId);

	const [isSpectator, setIsSpectator] = useState<boolean>();

	useEffect(() => {
		if (props.spectators && playerId) {
			setIsSpectator(props.spectators.map(e => e.id).includes(playerId));
		}
	}, [playerId, props.spectators])

	return isSpectator ? (
		<SpectatorView
			lobby={props.lobby}
			spectators={props.spectators}
			currentPlayer={props.currentPlayer}
			leaveGame={props.leaveGame}
			engine={props.engine}
			setEngine={props.setEngine}
		/>
	) : (
		<PlayerView
			lobby={props.lobby}
			socket={props.socket}
			currentPlayer={props.currentPlayer}
			updateLobby={props.updateLobby}
			leaveGame={props.leaveGame}
			spectators={props.spectators}
			engine={props.engine}
			setEngine={props.setEngine}
		/>
	)
}