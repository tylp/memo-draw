import { Socket } from 'socket.io';
import PlayerFactory from '../../factories/PlayerFactory';
import SocketIdentifierService from '../../services/SocketIdentifierService';
import Application from '../Application';
import SocketBinder from './SocketBinder';

export default class GameSocketBinder extends SocketBinder {
	static bindSocket(socket: Socket): void {
		this.onNextDrawing(socket);
	}

	static onNextDrawing(socket: Socket): void {
		socket.on('next-drawing', () => {
			const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
			const lobby = Application.getPlayerLobbyStorage().getLobbyOf(SocketIdentifierService.getSessionIdentifier(socket));
			if (lobby?.game?.isTurnOf(player)) {
				lobby.game.nextDrawing();
				socket.in(lobby.getSocketRoomName()).emit('update-game', lobby.game);
			}
		});
	}
}