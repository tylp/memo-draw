import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import {useSocketRoom} from '../../hooks';
import Link from 'next/link';

const Room = () => {
	const btnStyle = {
		flex: 0.3,
		fontWeight: 'bold', 
		color:'white', 
		backgroundColor: 'black', 
		padding: 4
	}
	const router = useRouter();
	const { id } = router.query;
	const socket = useSocketRoom();
	const [url, setUrl] = useState('');
	const [usersList, setUsersList] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [roomID, setRoomID] = useState(id);
    const [user, setUser] = useState({});
    const [connected, setConnected] = useState(false);

	//executed when component is updated
	useEffect(() => {
		// console.log('roomID: ', roomID, 'connected?', connected);
		if(roomID && !connected)
		{
			socket.on("session", ({ sessionID, userID, username }) => {
				console.log('hydrating session');
				
				// attach the session ID to the next reconnection attempts
				socket.auth = { sessionID };
				// store it in the localStorage
				localStorage.setItem("sessionID", sessionID);
				// save the ID of the user
				socket.userID = userID;
				console.log('username: ', username);
				
				socket.username = username;
	
				setUser({
					sessionID: socket.auth.sessionID, 
					userID: socket.userID,
					username: socket.username
				});
	
				console.log('joining-room: ', roomID);
				socket.emit("joining-room", 
					roomID, 
					{
						sessionID: socket.auth.sessionID, 
						userID: socket.userID,
						username: socket.username
					}
				);
			});

			const sessionID = localStorage.getItem("sessionID");
			console.log('sessionID: ', sessionID);
			if (sessionID) {
				console.log('utilisateur reconnu !');
				setConnected(true);
				socket.auth = { sessionID };
				socket.connect();
			} else {
				
			}
		}
		else if(router.query.id && !roomID){
			setRoomID(router.query.id);
		}
	});

	//executed when component is created (one time)
	useEffect(() => {
		setUrl(window.location.href.toString());
		console.log('je passe !');

		socket.on("connect", () => {
            console.log('connect');
        });
		
		// socket.onAny((event, ...args) => {
		// 	console.log(event, args);
		// });

		socket.on("clients", (clients) => {
			setUsersList(clients);
		})

		socket.on("player connected", (newUser) => {
            console.log('a new player joined the room');
            setUsersList((prevList) => [...prevList, newUser]);
        });

		socket.on("player disconnected", (oldUserID) => {
            setUsersList((prevList) => prevList.map((user) => {
                if(user.userID !== oldUserID)
                    return user
            }));
        });

		socket.on("new message", (message) => {
            console.log(`message: ${message.content}`);
            setMessages((prevList) => [...prevList, message]);
			// console.log('usersList', usersList);
        });

		window.onbeforeunload = (e) => {
			socket.emit('leaving-room');
			socket.close();
		};

		return () => {
			socket.emit('leaving-room');
			console.log('client off');
			socket.off("session");
			socket.off("connect");
			socket.off("joining-room");
			socket.off("clients");
			socket.off("player connected");
			socket.close();
		}
	}, []);

	// window.onbeforeunload = () => {
	// 	console.log('client off');
	// 	socket.emit('leaving-room');
	// 	socket.close();
	// }

	// const unknownUser = () => {
	// 	setUnknownUsers(true)
	// }

	const handleMessage = (e) => {
		setMessage(e.currentTarget.value);
	}

	const sendMessage = (e) => {
		e.preventDefault();
		setMessage('');
		socket.emit("new message", message, roomID);
	}

	const paperClip = (e) => {
		e.preventDefault();
		navigator.clipboard.writeText(url).then(function() {
			console.log('url: ', url);
			
		}, function() {
			console.log('fail');
		});
	}

	return (
		<div style={{backgroundColor: 'lightgrey'}}>
			<Link href="/">
				<button style={btnStyle} >
					&larr; Quitter le salon
				</button>
			</Link>
			<p>Room: {id}</p>
			<p>Socket: {user.sessionID}</p>
			<p>utilisateurs: {JSON.stringify(usersList)}</p>
			<p><button onClick={paperClip} style={btnStyle}>Envoyer le lien à vos amis</button></p>
			<h3 style={{fontWeight: 'bold'}}>Messages du salon :</h3>
			<ul>
				{messages.map((msg, key) => (
				<li key={key}>
					<span style={{fontWeight:'bold'}}>{msg.username}</span> : {msg.content}
				</li>
				))}
			</ul>
			<form action="" style={{display: 'flex'}}>
				<input type="text" onChange={handleMessage} style={{flex: 0.7, padding: 3}} value={message}/>
				{/* <textarea name="" id="" cols="50" rows="3"></textarea><br /> */}
				<button 
					type="submit" 
					onClick={sendMessage} 
					style={btnStyle}
				>Envoyer</button>
			</form>
			<p>&nbsp;</p>
		</div>
	)
}

export default Room;