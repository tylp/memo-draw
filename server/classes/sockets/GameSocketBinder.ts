import { IAction } from 'memo-draw-engine';
import { Socket } from 'socket.io';
import LobbyFacade from '../../facades/LobbyFacade';
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
			LobbyFacade.nextDrawing(socket);
		});
	}

	static onNetworkManagerUpdate(socket: Socket): void {
		socket.on('network-manager-update', (elem: IAction) => {
			const lobby = Application.getPlayerLobbyStorage().getLobbyOf(SocketIdentifierService.getSessionIdentifier(socket));
			socket.to(lobby?.getSocketRoomName()).emit('network-manager-update', elem);
		})
	}

	static onPlayAgain(socket: Socket): void {
		socket.on('play-again', () => {
			LobbyFacade.playAgain(socket);
		})
	}
}