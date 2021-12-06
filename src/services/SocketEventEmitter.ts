import { GameModeProperty } from './../../server/enums/GameProperties';
import { Socket } from 'socket.io-client';
import { Lobby, Player } from '../../server/classes';
import { YesOrNo } from '../../server/classes/Votes/YesNoVote';
import IProfile from '../../server/interfaces/IProfile';

export default class SocketEventEmitter {
	public static createLobby(socket: Socket, ack: () => void): void {
		socket.emit('create-lobby', ack);
	}

	public static updateProfile(socket: Socket, profile: IProfile, ack: () => void): void {
		socket.emit('update-profile', profile, ack);
	}

	public static checkAlreadyInLobby(socket: Socket, ack: (hasLobby: boolean) => void): void {
		socket.emit('check-already-in-lobby', ack);
	}

	public static startGame(socket: Socket, gameModeProperty: GameModeProperty): void {
		socket.emit('start-game', gameModeProperty);
	}

	public static leaveLobby(socket: Socket): void {
		socket.emit('leave-lobby');
	}

	public static invitedInLobby(socket: Socket, lobbyId: Lobby['id'], ack: (data: boolean) => void): void {
		socket.emit('invited-in-lobby', lobbyId, ack);
	}

	public static kickPlayerFromLobby(socket: Socket, playerId: Player['id']): void {
		socket.emit('kick-player-from-lobby', playerId);
	}

	public static joinLobby(socket: Socket, ack: (joinedLobby: Lobby) => void): void {
		socket.emit('join-lobby', ack);
	}

	public static nextDrawing(socket: Socket): void {
		socket.emit('next-drawing')
	}

	public static startVote(socket: Socket, selectedPlayer: Player): void {
		socket.emit('start-vote', selectedPlayer);
	}

	public static vote(socket: Socket, vote: YesOrNo): void {
		socket.emit('vote', vote);
	}

	public static playAgain(socket: Socket): void {
		socket.emit('play-again');
	}

	public static updateGameMode(socket: Socket, gamemode: GameModeProperty): void {
		socket.emit('update-gamemode', gamemode)
	}
}