import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import next from 'next';

import Application from './classes/Application';

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

Application.getInstance().bindServer(io);
Application.startClearEmptyLobbies();

nextApp.prepare().then(() => {
	app.get('*', (req, res) => nextHandler(req, res));

	server.listen(port,  () => {
		console.log(`> Ready on http://localhost:${port}`);
	});
});