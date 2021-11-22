import { Socket } from 'socket.io-client';
import useSocket from './useSocket';

export default function useSocketLobby(): Socket {
	return useSocket({ namespace: '/game' });
}