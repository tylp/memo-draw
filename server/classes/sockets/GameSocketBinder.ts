import { ActionType, IAction } from 'memo-draw-engine';
import { Socket } from 'socket.io';
import LobbyFacade from '../../facades/LobbyFacade';
import PlayerFactory from '../../factories/PlayerFactory';
import SocketIdentifierService from '../../services/SocketIdentifierService';
import Application from '../Application';
import SocketBinder from './SocketBinder';

export default class GameSocketBinder extends SocketBinder {
	static bindSocket(socket: Socket): void {
		this.onNextDrawing(socket);
		this.onNetworkManagerUpdate(socket);
		this.onPlayAgain(socket);
	}

	static onNextDrawing(socket: Socket): void {
		socket.on('next-drawing', () => {
			const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
			const lobby = Application.getPlayerLobbyStorage().getLobbyOf(SocketIdentifierService.getSessionIdentifier(socket));
			if (lobby?.game?.isTurnOf(player)) {
				lobby.game.nextDrawing();
				Application.getSocketIoInstance().of('/game').to(lobby.getSocketRoomName()).emit('update-lobby', lobby);
				Application.getSocketIoInstance().of('/game').to(lobby.getSocketRoomName()).emit('network-manager-update', {
					type: ActionType.Reset,
					parameters: undefined,
				});
			}
		});
	}

	static onNetworkManagerUpdate(socket: Socket): void {
		socket.on('network-manager-update', (elem: IAction) => {
			const lobby = Application.getPlayerLobbyStorage().getLobbyOf(SocketIdentifierService.getSessionIdentifier(socket));
			socket.to(lobby.getSocketRoomName()).emit('network-manager-update', elem);
		})
	}

	static onPlayAgain(socket: Socket): void {
		socket.on('play-again', () => {
			LobbyFacade.playAgain(socket);
		})
	}
}