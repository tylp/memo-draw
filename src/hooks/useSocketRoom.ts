import { useEffect } from 'react'
import io from 'socket.io-client'

const socket = io("/room", { autoConnect: false});

export default function useSocketRoom(eventName, cb) {
	useEffect(() => {
		socket.onAny((event, ...args) => {
			console.log(event, args);
		});

		socket.on(eventName, cb)

		return function useSocketCleanup() {
			socket.off(eventName, cb)
		}
	}, [eventName, cb])

	return socket
}