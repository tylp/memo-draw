import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import io from "socket.io-client";
import ISession from '../../server/interfaces/ISession';

interface IUseSocket {
    namespace?: string,
}

export default function useSocket({namespace}: IUseSocket = {}): SocketIOClient.Socket {
	const [sessionId, setSessionId] = useLocalStorage('sessionId');
	const [, setPlayerId] = useLocalStorage('playerId');
	const [, setProfile] = useLocalStorage('profile');
	const [activeSocket, setActiveSocket] = useState<SocketIOClient.Socket>();	

    useEffect(() => {
        if(typeof window === "undefined") return;

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
            setProfile(data.profile)
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