import { Socket } from 'socket.io-client';
import { AbstractNetworkManager, IAction } from 'memo-draw-engine';

class NetworkManager extends AbstractNetworkManager {
	socket: Socket;

	constructor(socket: Socket) {
		super();
		this.socket = socket;
	}

	update(elem: IAction): void {
		this.socket.emit('network-manager-update', elem);
	}
}

export default NetworkManager;
