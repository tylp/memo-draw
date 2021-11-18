import { GameModeProperties } from './../../server/enums/GameProperties';
import { Socket } from 'socket.io-client';
import { Lobby, Player } from '../../server/classes';
import { YesOrNo } from '../../server/classes/Votes/YesNoVote';
import IProfile from '../../server/interfaces/IProfile';

export default class SocketEventEmitter {
	socket: typeof Socket;

	constructor(socket: typeof Socket) {
		this.socket = socket;
	}

	public createLobby(ack: () => void): void {
		this.socket.emit('create-lobby', ack);
	}

	public updateProfile(profile: IProfile, ack: () => void): void {
		this.socket.emit('update-profile', profile, ack);
	}

	public checkAlreadyInLobby(ack: (hasLobby: boolean) => void): void {
		this.socket.emit('check-already-in-lobby', ack);
	}

	public startGame(gameMode: GameModeProperties): void {
		this.socket.emit('start-game', gameMode);
	}

	public leaveLobby(): void {
		this.socket.emit('leave-lobby');
	}

	public invitedInLobby(lobbyId: Lobby['id'], ack: (data: boolean) => void): void {
		this.socket.emit('invited-in-lobby', lobbyId, ack);
	}

	public kickPlayerFromLobby(playerId: Player['id']): void {
		this.socket.emit('kick-player-from-lobby', playerId);
	}

	public joinLobby(ack: (joinedLobby: Lobby) => void): void {
		this.socket.emit('join-lobby', ack);
	}

	public nextDrawing(): void {
		this.socket.emit('next-drawing')
	}

	public startVote(selectedDrawing: number): void {
		this.socket.emit('start-vote', selectedDrawing);
	}

	public vote(vote: YesOrNo): void {
		this.socket.emit('vote', vote);
	}
}