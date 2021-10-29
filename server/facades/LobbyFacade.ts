import { Socket } from 'socket.io';
import Application from '../classes/Application';
import Lobby from '../classes/Lobby';
import PlayerFactory from '../factories/PlayerFactory';
import LobbyService from '../services/LobbyService';
import SocketIdentifierService from '../services/SocketIdentifierService';

export default class LobbyFacade {
	public static create(socket: Socket): Lobby {
		const lobby = LobbyService.create(SocketIdentifierService.getIdentifiersOf(socket))

		return LobbyFacade.join(socket, lobby.id);
	}

	public static join(socket: Socket, lobbyId: Lobby['id']): Lobby {
		const sessionOfSocket = SocketIdentifierService.getSessionOf(socket);
		const lobby = Application.getLobbyStorage().get(lobbyId);
		const player = PlayerFactory.create(sessionOfSocket);

		lobby.add(player);
		socket.join(lobby.getSocketLobbyName());
		LobbyService.linkPlayerToLobby(sessionOfSocket.sessionId, lobby.id);

		return lobby;
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
			socket.to(Lobby.getLobbyName(updatedLobby.id)).emit('update-lobby', updatedLobby);
		}

		return updatedLobby;
	}

	public static startGame(socket: Socket): void {
		const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
		const lobbyId = Application.getPlayerLobbyStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
		const lobby = Application.getLobbyStorage().get(lobbyId);

		if (LobbyService.start(lobby, player)) {
			socket.emit('game-started', lobby);
			socket.to(Lobby.getLobbyName(lobbyId)).emit('game-started', lobby);
		}
	}

	public static kick(socket: Socket, kickedPlayerId: string): Lobby {
		const updatedLobby = LobbyService.kick(SocketIdentifierService.getIdentifiersOf(socket), kickedPlayerId);

		socket.to(Lobby.getLobbyName(updatedLobby.id)).emit('update-lobby', updatedLobby);
		socket.to(Lobby.getLobbyName(updatedLobby.id)).emit('kicked-player', kickedPlayerId);

		return updatedLobby;
	}

	public static quit(socket: Socket): Lobby {
		const updatedLobby = LobbyService.quit(SocketIdentifierService.getIdentifiersOf(socket))

		socket.to(Lobby.getLobbyName(updatedLobby.id)).emit('update-lobby', updatedLobby);

		return updatedLobby;
	}

}
