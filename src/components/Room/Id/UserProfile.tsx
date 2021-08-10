import React from "react";
import { UserProfileSpec } from "./UserProfile.spec";

export default function UserProfile(props: UserProfileSpec): JSX.Element {
    return (
		<div className="bg-blue-darker-blue h-12 w-56 rounded-l-full flex flex-row items-center mb-4" style={{borderRadius: '50px 10px 10px 50px'}}>
			<img
				className="ml-1 h-10 w-10 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
			<div className="flex-1 text-white-white font-bold text-start text-md leading-4 m-0 p-2 pl-4">{props.player.profile.username}</div>
		</div>
    )
}