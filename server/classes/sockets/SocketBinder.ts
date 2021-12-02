import { Socket } from 'socket.io';
export default abstract class SocketBinder {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static bindSocket(socket: Socket): void {
		throw new Error('Missing method: bindSocket in ' + this.constructor.name);
	}
}