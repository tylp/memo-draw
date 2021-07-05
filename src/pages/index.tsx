import React, { useEffect, useState } from 'react';
import {useSocket} from '../hooks';

interface HelloMessage {
    timestamp: number;
    value: string;
}

export default function Index() : React.ReactNode {

    const socket: SocketIOClient.Socket = useSocket();
    const [value, setValue] = useState<string>("");

    useEffect(() => {
        if (socket) {
            socket.on("hello-room", (message: HelloMessage) => {
                console.log(message)
            });
        }
    }, [socket]);

    // Handle input change
    const handleInputChange = (event) => {
        setValue(event.target.value);
    };

    
    /**
     * Emit <value> to "hello-room" topic.
     * Check the server.js console to see the message.
     */ 
    function emmitData() {

        const msg: HelloMessage = {
            timestamp: new Date().getTime(),
            value: value
        }

        socket &&
            socket.emit("hello-room", msg);
    }

    return (
        <div className="flex p-3">
            <input className="rounded border-4 bg-green-600" onChange={handleInputChange}></input>
            <button className="rounded shadow-md bg-green-600 p-3.5 ml-2" onClick={emmitData}>Send</button>
        </div>

    );
}