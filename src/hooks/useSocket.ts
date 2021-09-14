import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import io from "socket.io-client";
import ISession from '../../server/interfaces/ISession';
import IProfile from '../../server/interfaces/IProfile';
import { EnvironmentChecker } from '../services/EnvironmentChecker';

interface IUseSocket {
    namespace?: string,
}

export default function useSocket({namespace}: IUseSocket = {}): SocketIOClient.Socket {
	const [sessionId, setSessionId] = useLocalStorage<string>('sessionId');
	const [, setPlayerId] = useLocalStorage<string>('playerId');
	const [profile, setProfile] = useLocalStorage<IProfile>('profile');
	const [activeSocket, setActiveSocket] = useState<SocketIOClient.Socket>();	

    useEffect(() => {
        if(EnvironmentChecker.isServerSide()) return;

        if(!setActiveSocket) return;
        
        const newSocket = io(
            namespace || "/",
            {
                autoConnect: true,
                auth: {
                    sessionId: sessionId,
                }
            }
        )

        newSocket.on("new-session", (data: ISession) => {
            setSessionId(data.sessionId)
            setPlayerId(data.playerId)
            const mergedProfile = {
                ...data.profile,
                ...profile
            }
            newSocket.emit("update-profile", mergedProfile, () => {
                setProfile(mergedProfile)
            });
        })

        setActiveSocket(newSocket)

        if(!activeSocket) return;

        return function cleanup() {
			activeSocket.close()
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setActiveSocket]);

    return activeSocket;
}