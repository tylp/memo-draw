import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import Client from 'socket.io-client';
import { AddressInfo } from 'net';

describe('alo', () => {
	let io;
	let clientSocket: SocketIOClient.Socket;
	let serverSocket: Socket;

	beforeAll((done) => {
		const httpServer = createServer();
		io = new Server(httpServer);
		httpServer.listen(() => {
			const { port } = httpServer.address() as AddressInfo;
			clientSocket = Client(`http://localhost:${port}`);
			io.on('connection', (socket) => {
				serverSocket = socket;
			});
			clientSocket.on('connect', done);
		});
	});

	afterAll(() => {
		io.close();
		clientSocket.close();
	});

	test('should work', (done) => {
		clientSocket.on('hello', (arg) => {
			expect(arg).toBe('world');
			done();
		});
		serverSocket.emit('hello', 'world');
	});

	test('should work (with ack)', (done) => {
		serverSocket.on('hi', (cb) => {
			cb('hola');
		});
		clientSocket.emit('hi', (arg) => {
			expect(arg).toBe('hola');
			done();
		});
	});
});