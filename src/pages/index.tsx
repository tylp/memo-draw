import React, { useEffect, useState } from 'react';
import {Layout} from "../components/Common";
import {ProfileSelector, RuleItem} from "../components/Home";
import RoomSelector from '../components/RoomSelector';
import { useSocket } from '../hooks';

// interface HelloMessage {
//     timestamp: number;
//     value: string;
// }

export default function Index() : React.ReactNode {
    // const socket: SocketIOClient.Socket = useSocket();
    // const [value, setValue] = useState<string>("");
    const socket = useSocket();
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState<string>("");
    const [usernameAlreadySelected, setUsernameAlreadySelected] = useState<boolean>(false);

    //executed when component is updated (multiple time)
    useEffect(() => {
        // console.log('usersList: ', usersList);
    });

    //executed when component is created (one time)
    useEffect(() => {
        const sessionID = localStorage.getItem("sessionID");
        if (sessionID) {
			setIsLoading(true);
            socket.auth = { sessionID };
            socket.connect();
        }
		else
			setIsLoading(false)

        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
				setIsLoading(false);
                setUsernameAlreadySelected(false);
            }
        });

        socket.on("connect", () => {
            console.log('connect');
			setIsLoading(false);
            setUsernameAlreadySelected(true);
        });

        //executed when component is dismounted (one time)
        return () => {
            console.log('client off');
            socket.off("connect_error");
            socket.off("connect");
            socket.off("disconnect");
            socket.off("user connected");
            socket.off("user disconnected");
            socket.off("users");
            socket.off("manual-disconnect");
            socket.close();
        }
    }, []);

    // // Handle input change
    // const handleInputChange = (event) => {
    //     setValue(event.target.value);
    // };

    // Handle username input change
    const handleUsername = (e) => {
        setUsername(e.currentTarget.value);
    }


	// Handle submit
    const handleSubmit = () => {
        setUsernameAlreadySelected(true);
        socket.auth = { username };
        socket.connect();
    }

	const clearStorage = (e) => {
        e.preventDefault();
        localStorage.clear();
	}

    const handleDisconnect = () => {
        localStorage.clear();
        setUsernameAlreadySelected(false);
		socket.emit('manual-disconnect', 'manual disconnect');
        socket.disconnect();
	}

    const handleRoomCreation = () => {
		socket.emit('create-room', socket.userID);
	}

    /**
     * Emit <value> to "hello-room" topic.
     * Check the server.js console to see the message.
     */ 
    // function emmitData() {
    //     const msg: HelloMessage = {
    //         timestamp: new Date().getTime(),
    //         value: value
    //     }
    //     socket &&
    //         socket.emit("hello-room", msg);
    // }

    return (
		<div>
			{isLoading ? <div>Loading...</div> : 
			!usernameAlreadySelected ?
				<Layout>
					<div className="flex flex-wrap flex-auto justify-center md:space-x-32">
						<div>
							<RuleItem id={1} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
							<RuleItem id={2} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
							<RuleItem id={3} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
						</div>
						<div >
							<ProfileSelector 
							handleSubmit={handleSubmit}
							handleUserName={handleUsername}/>
						</div>
					</div>
				</Layout>
			:
				<RoomSelector
				socket={socket}
				onHandleRoomCreation={handleRoomCreation}
				onHandleDisconnect={handleDisconnect}
				/>
			}
		</div>
    );
}