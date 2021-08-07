import useSocket from './useSocket';

export default function useSocketRoom(): SocketIOClient.Socket {
	return useSocket({namespace: "/room"});
}