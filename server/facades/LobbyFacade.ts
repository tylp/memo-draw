import { Socket } from 'socket.io';
import Application from '../classes/Application';
import Lobby from '../classes/Lobby';
import PlayerFactory from '../factories/PlayerFactory';
import LobbyService from '../services/LobbyService';
import SocketIdentifierService from '../services/SocketIdentifierService';

export default class LobbyFacade {
	public static create(socket: Socket): Lobby {
		const room = LobbyService.create(SocketIdentifierService.getIdentifiersOf(socket))

		return LobbyFacade.join(socket, room.id);
	}

	public static join(socket: Socket, roomId: Lobby['id']): Lobby {
		const sessionOfSocket = SocketIdentifierService.getSessionOf(socket);
		const room = Application.getLobbyStorage().get(roomId);
		const player = PlayerFactory.create(sessionOfSocket);

		room.add(player);
		socket.join(room.getSocketLobbyName());
		LobbyService.linkPlayerToLobby(sessionOfSocket.sessionId, room.id);

		return room;
	}

	public static rejoin(socket: Socket): Lobby {
		const joinedLobbyId = Application.getPlayerLobbyStorage().get(SocketIdentifierService.getSessionIdentifier(socket))

		if (joinedLobbyId) {
			socket.join(Lobby.getLobbyName(joinedLobbyId));
		}

		return this.reassignHost(socket);
	}

	public static reassignHost(socket: Socket): Lobby {
		const updatedLobby = LobbyService.reassignHost(SocketIdentifierService.getIdentifiersOf(socket));

		if (updatedLobby) {
			socket.to(Lobby.getLobbyName(updatedLobby.id)).emit('update-room', updatedLobby);
		}

		return updatedLobby;
	}

	public static startGame(socket: Socket): void {
		const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
		const roomId = Application.getPlayerLobbyStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
		const room = Application.getLobbyStorage().get(roomId);

		if (LobbyService.start(room, player)) {
			socket.emit('game-started', room);
			socket.to(Lobby.getLobbyName(roomId)).emit('game-started', room);
		}
	}

	public static kick(socket: Socket, kickedPlayerId: string): Lobby {
		const updatedLobby = LobbyService.kick(SocketIdentifierService.getIdentifiersOf(socket), kickedPlayerId);

		socket.to(Lobby.getLobbyName(updatedLobby.id)).emit('update-room', updatedLobby);
		socket.to(Lobby.getLobbyName(updatedLobby.id)).emit('kicked-player', kickedPlayerId);

		return updatedLobby;
	}

	public static quit(socket: Socket): Lobby {
		const updatedLobby = LobbyService.quit(SocketIdentifierService.getIdentifiersOf(socket))

		socket.to(Lobby.getLobbyName(updatedLobby.id)).emit('update-room', updatedLobby);

		return updatedLobby;
	}

}
