import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import io from "socket.io-client";

interface IUseSocket {
    callback?: (s: SocketIOClient.Socket) => void;
}

export default function useSocket(props?: IUseSocket): SocketIOClient.Socket {
	const [sessionID, setSessionId] = useLocalStorage('sessionID');
	const [activeSocket, setActiveSocket] = useState<SocketIOClient.Socket>(
		io(
			{
				autoConnect: true,
				auth: {
					sessionID: sessionID
				}
			}
		));	

    useEffect(() => {
        console.log(sessionID)
        if(!sessionID) {
            console.log("executing");
            activeSocket.emit("start-session", (session) => {
                console.log("ivi")
                console.log(session)
                setSessionId(session.sessionID);
            })
        }

        return function cleanup() {
			activeSocket.close()
        };
    }, [activeSocket, props]);

    return activeSocket;
}