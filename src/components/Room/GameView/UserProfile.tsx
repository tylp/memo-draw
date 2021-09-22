import React from "react";
import { UserProfileSpec } from "./UserProfile.spec";

export default function UserProfile(props: UserProfileSpec): JSX.Element {
    return (
        <p className="bg-blue-200 w-full border-2 rounded border-yellow-light-yellow pl-2 text-white-white">
            {props.player.profile.username} {props.currentPlayer.id === props.player.id ? "Current" : ""}
        </p>
    )
}