import { Server } from 'socket.io';
import IndexNamespaceBinder from './namespaces/IndexNamespaceBinder';
import LobbyNamespaceBinder from './namespaces/LobbyNamespaceBinder';

export default class SocketIoBinder {
	static bindServer(io: Server): Server {
		IndexNamespaceBinder.bindServer(io);
		LobbyNamespaceBinder.bindServer(io);
		return io;
	}
}