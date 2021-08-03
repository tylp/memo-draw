import React, { useEffect, useState } from 'react';
import {Layout} from "../components/Common";
import Loading from '../components/Common/Loading/Loading';
import {ProfileSelector, RuleItem} from "../components/Home";
import RoomSelector from '../components/RoomSelector';
import { useSocket } from '../hooks';

export default function Index() : React.ReactNode {
	const socket = useSocket();
	const [isLoading, setIsLoading] = useState(true);
	const [username, setUsername] = useState<string>("");
	const [usernameAlreadySelected, setUsernameAlreadySelected] = useState<boolean>(false);

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

	const handleDisconnect = () => {
		localStorage.clear();
		setUsernameAlreadySelected(false);
		socket.emit('manual-disconnect', 'manual disconnect');
		socket.disconnect();
	}

	const handleRoomCreation = () => {
		socket.emit('create-room', socket.userID);
	}

	return (
		<div>
			{isLoading ? 
				<Loading/>
			: 
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