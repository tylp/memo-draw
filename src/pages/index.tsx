import React, { useEffect, useState } from 'react';
import {useSocket} from '../hooks';
import {Layout} from "../components/Common";
import {ProfileSelector, RuleItem} from "../components/Home";

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
        <Layout>
            <div className="flex flex-wrap flex-auto justify-center md:space-x-32">
                <div>
                    <RuleItem id={1} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
                    <RuleItem id={2} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
                    <RuleItem id={3} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
                </div>
                <div >
                    <ProfileSelector />
                </div>
            </div>
        </Layout>

    );
}