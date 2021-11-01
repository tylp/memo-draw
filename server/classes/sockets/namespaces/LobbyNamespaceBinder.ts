import CommonSocketBinder from '../CommonSocketBinder';
import GameSocketBinder from '../GameSocketBinder';
import LobbySocketBinder from '../LobbySocketBinder';
import AbstractNamespaceBinder from './AbstractNamespaceBinder';

export default class LobbyNamespaceBinder extends AbstractNamespaceBinder {
	protected static applyEvents(): void {
		this.io.of('/lobby').on('connection', (socket) => {
			console.log('inside', socket);
			// CommonSocketBinder.bindSocket(socket);
			// LobbySocketBinder.bindSocket(socket);
			// GameSocketBinder.bindSocket(socket);
		});
	}
}