import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage/useLocalStorage';
import io, { Socket } from 'socket.io-client';
import ISession from '../../server/interfaces/ISession';
import IProfile from '../../server/interfaces/IProfile';
import { EnvironmentChecker } from '../services/EnvironmentChecker';
import { LocalStorageKey } from './useLocalStorage/useLocalStorage.types';
import SocketEventEmitter from '../services/SocketEventEmitter';

interface IUseSocket {
	namespace?: string,
}

export default function useSocket({ namespace }: IUseSocket = {}): Socket {
	const [sessionId, setSessionId] = useLocalStorage<string>(LocalStorageKey.SessionId);
	const [, setPlayerId] = useLocalStorage<string>(LocalStorageKey.PlayerId);
	const [profile, setProfile] = useLocalStorage<IProfile>(LocalStorageKey.Profile);
	const [activeSocket, setActiveSocket] = useState<Socket>();

	useEffect(() => {
		if (EnvironmentChecker.isServerSide()) return;

		if (!setActiveSocket) return;

		const newSocket = io(
			namespace || '/',
			{
				autoConnect: true,
				auth: {
					sessionId: sessionId,
				},
			},
		)

		newSocket.on('update-session', (data: ISession) => {
			setSessionId(data.sessionId)
			setPlayerId(data.playerId)
			const mergedProfile = {
				...data.profile,
				...profile,
			}
			setProfile(mergedProfile)
		})

		setActiveSocket(newSocket)

		if (!activeSocket) return;

		return function cleanup() {
			activeSocket.close()
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setActiveSocket]);

	useEffect(() => {
		if (!activeSocket) return;
		SocketEventEmitter.updateProfile(activeSocket, profile, () => {
			//
		})
	}, [profile, activeSocket])

	return activeSocket;
}