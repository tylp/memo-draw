import { faRecycle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Avatar from "../../Common/Avatar/Avatar";
import { UserCardSpec } from "./UserCard.spec";

export default function UserCard(props: UserCardSpec): JSX.Element {
    return (
		<div className="bg-blue-darker-blue h-36 w-32 rounded-md flex flex-col items-center m-2">
			{/* <img
				className="mt-6 h-16 w-16 rounded-full ring-4 ring-yellow-light-yellow"
				src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/> */}
			<div className="relative -top-2 left-8  rounded-full m-0 w-6 h-6 bg-pink-dark-pink font-bold text-white-white text-center"><FontAwesomeIcon icon={faTrash}/></div>
			<div className="w-2/3 h-2/3">
				<Avatar avatar={props.player.profile.avatar}/>
			</div>
			<div className="flex-1 text-center text-white-white font-bold text-sm text-start leading-4 pt-0">{props.player.profile.username}</div>
		</div>
    )
}