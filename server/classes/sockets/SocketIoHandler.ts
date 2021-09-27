import { Server } from 'socket.io';
import IndexNamespaceBinder from './namespaces/IndexNamespaceBinder';
import RoomNamespaceBinder from './namespaces/RoomNamespaceBinder';

export default class SocketIoBinder {
	static bindServer(io: Server): Server {
		IndexNamespaceBinder.bindServer(io);
		RoomNamespaceBinder.bindServer(io);
		return io;
	}	
}