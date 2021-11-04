import { Socket } from 'socket.io-client';
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
}