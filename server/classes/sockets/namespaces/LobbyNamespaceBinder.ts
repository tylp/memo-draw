import CommonSocketBinder from '../CommonSocketBinder';
import GameSocketBinder from '../GameSocketBinder';
import LobbySocketBinder from '../LobbySocketBinder';
import AbstractNamespaceBinder from './AbstractNamespaceBinder';

export default class LobbyNamespaceBinder extends AbstractNamespaceBinder {
	protected static applyEvents(): void {
		this.io.of('/game').on('connection', (socket) => {
			CommonSocketBinder.bindSocket(socket);
			LobbySocketBinder.bindSocket(socket);
			GameSocketBinder.bindSocket(socket);
		});
	}
}