import { GameModeProperty } from './../../server/enums/GameProperties';
import { Socket } from 'socket.io-client';
import { Lobby, Player } from '../../server/classes';
import { YesOrNo } from '../../server/classes/Votes/YesNoVote';
import IProfile from '../../server/interfaces/IProfile';

export default class SocketEventEmitter {
	public static createLobby(socket: typeof Socket, ack: () => void): void {
		socket.emit('create-lobby', ack);
	}

	public static updateProfile(socket: typeof Socket, profile: IProfile, ack: () => void): void {
		socket.emit('update-profile', profile, ack);
	}

	public static checkAlreadyInLobby(socket: typeof Socket, ack: (hasLobby: boolean) => void): void {
		socket.emit('check-already-in-lobby', ack);
	}

	public static startGame(socket: typeof Socket, gameModeProperty: GameModeProperty): void {
		socket.emit('start-game', gameModeProperty);
	}

	public static leaveLobby(socket: typeof Socket): void {
		socket.emit('leave-lobby');
	}

	public static invitedInLobby(socket: typeof Socket, lobbyId: Lobby['id'], ack: (data: boolean) => void): void {
		socket.emit('invited-in-lobby', lobbyId, ack);
	}

	public static kickPlayerFromLobby(socket: typeof Socket, playerId: Player['id']): void {
		socket.emit('kick-player-from-lobby', playerId);
	}

	public static joinLobby(socket: typeof Socket, ack: (joinedLobby: Lobby) => void): void {
		socket.emit('join-lobby', ack);
	}

	public static nextDrawing(socket: typeof Socket): void {
		socket.emit('next-drawing')
	}

	public static startVote(socket: typeof Socket, selectedDrawing: number): void {
		socket.emit('start-vote', selectedDrawing);
	}

	public static vote(socket: typeof Socket, vote: YesOrNo): void {
		socket.emit('vote', vote);
	}
}