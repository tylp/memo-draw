import { Socket } from 'socket.io';
import LobbyFacade from '../../facades/LobbyFacade';
import SocketIdentifierService from '../../services/SocketIdentifierService';
import Application from '../Application';
import SocketBinder from './SocketBinder';

export default class IndexSocketBinder extends SocketBinder {
	static bindSocket(socket: Socket): void {
		this.onLobbyCreation(socket);
		this.onCheckAlreadyInLobby(socket);
	}

	private static onLobbyCreation(socket: Socket): void {
		socket.on('create-lobby', (ack) => {
			ack(LobbyFacade.create(socket));
		});
	}

	private static onCheckAlreadyInLobby(socket: Socket): void {
		socket.on('check-already-in-lobby', (ack) => {
			const sessionId = SocketIdentifierService.getSessionIdentifier(socket);
			ack(!!Application.getPlayerLobbyStorage().getLobbyOf(sessionId))
		});
	}
}
