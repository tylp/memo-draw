import { useEffect } from 'react';
import io from "socket.io-client";

const socket = io({ autoConnect: false});

export default function useSocket(eventName, cb) {
	useEffect(() => {
		// uncomment to log every socket event
		// socket.onAny((event, ...args) => {
		// 	console.log(event, args);
		// });

		socket.on(eventName, cb)

		return function useSocketCleanup() {
			socket.off(eventName, cb)
		}
	}, [eventName, cb])

	return socket
}