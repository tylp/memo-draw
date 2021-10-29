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
			const roomOfPlayer = Application.getPlayerLobbyStorage().getRoomOf(SocketIdentifierService.getSessionIdentifier(socket));
			const game = roomOfPlayer.game;
			if (game.isTurnOf(player)) {
				game.nextDrawing();
				socket.to(roomOfPlayer.getSocketRoomName()).emit('update-game', game);
			}
		});
	}
}