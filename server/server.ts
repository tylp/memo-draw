const app = require('express')();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

import Application from "./classes/Application";

const next = require('next');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

Application.bindServer(io);

nextApp.prepare().then(() => {
	app.get('*', (req, res) => nextHandler(req, res));

	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});