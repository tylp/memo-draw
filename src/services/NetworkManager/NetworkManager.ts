import { io, Socket } from 'socket.io-client';
import { AbstractNetworkManager, IAction } from 'memo-draw-engine';

class NetworkManager extends AbstractNetworkManager {
	socket: Socket;

	constructor() {
		super();
		this.socket = io('127.0.0.1:3004');
		this.socket.on('engine', (data) => this.on(data));
	}

	update(elem: IAction): void {
		this.socket.emit('engine', elem);
	}
}

export default NetworkManager;
