import useSocket from './useSocket';

export default function useSocketLobby(): SocketIOClient.Socket {
	return useSocket({ namespace: '/lobby' });
}