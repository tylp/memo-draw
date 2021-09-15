import React, { useEffect, useState } from 'react';
import IProfile, { RubberColor, BodyType, BodyColor, FaceType } from '../../server/interfaces/IProfile';
import {Layout, SectionTitle} from "../components/Common";
import Loading from '../components/Common/Loading/Loading';
import {ProfileSelector} from "../components/Home";
import RuleItem from '../components/Home/RuleList/RuleItem/RuleItem';
import { useSocket } from '../hooks';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Index(): JSX.Element {
	const socket = useSocket();
	const [isLoading, setIsLoading] = useState(true);
	const [username, setUsername] = useState<string>("");
	const [profileStorage, setProfileStorage] = useLocalStorage("profile")

	useEffect(() => {
		if(socket) {
			setIsLoading(false)
			if(profileStorage) {
				// TODO: Redirect to correct room.
			}
		}
	}, [socket, profileStorage]);

	const handleStart = () => {
		// TODO: Get profile from ProfileSelector
		const profile: IProfile = {
			username,
			avatar: {
				rubberColor: RubberColor[0],
				bodyType: BodyType[0],
				bodyColor: BodyColor[0],
				faceType: FaceType[0],
			}
		}
		
		socket.emit("update-profile", profile, () => {
			setProfileStorage(profile);
			handleRoomCreation();
		})
	}

	const handleRoomCreation = () => {
		socket.emit('create-room', (room) => {
			document.location.href = `/room/${room.id}`
		});
	}

	return (
		<div>
			{
			isLoading
			? (
				<Loading/>
			) 
			: (
				<Layout>
					<div className="flex md:space-x-32">
						<div>
							<SectionTitle hintColor="text-pink-dark-pink">THE GAME</SectionTitle>
							<RuleItem id={1} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
							<RuleItem id={2} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
							<RuleItem id={3} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
						</div>
						<div >
							<ProfileSelector 
							handleStart={handleStart}
							handleUserName={(e) => setUsername(e.currentTarget.value)}
							username={username}/>
						</div>
					</div>
				</Layout>
			)
			}
		</div>
	);
}
