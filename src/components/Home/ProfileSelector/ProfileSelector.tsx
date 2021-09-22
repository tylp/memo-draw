import React, {useEffect, useState } from "react";
import { Title } from "../../Common";
import Button from "../../Common/Button/Button";
import SectionTitle from "../../Common/SectionTitle/SectionTitle";
import { ProfileSelectorSpec, SelectButtonSpec } from "./ProfileSelector.spec";
import Avatar from "../../Common/Avatar/Avatar";

import IProfile, { RubberColor, BodyColor, FaceType } from "../../../../server/interfaces/IProfile";
import { useSocket } from "../../../hooks";
import useLocalStorage from "../../../hooks/useLocalStorage/useLocalStorage";
import { LocalStorageKey } from "../../../hooks/useLocalStorage/useLocalStorage.types";

export function SelectButton<T>(props: SelectButtonSpec<T>) : JSX.Element {

    const getNextValue = () => {
        if(props.list.indexOf(props.value) === props.list.length - 1)
            return props.list[0];
        return props.list[props.list.indexOf(props.value) + 1]
    }

    const getPreviousValue = () => {
        if(props.list.indexOf(props.value) === 0)
            return props.list[props.list.length - 1];
        return props.list[props.list.indexOf(props.value) - 1]
    }

    const onClick = () => {
        if(props.direction === "left") {
            sendPreviousValue();
        } else {
            sendNextValue();
        }
    }

    const sendNextValue = (): void => {
        props.setValue(getNextValue());
    }

    const sendPreviousValue = (): void => {
        props.setValue(getPreviousValue());
    }

    const arrowStyle = props.direction === "left" ? "icon icon-arrow-left w-8 fill-current text-white-white" : "transform rotate-180 icon icon-arrow-left w-8 fill-current text-white-white";

    return (
        <div className="flex flex-col items-center">
            <p className="text-md text-white-white">{props.name}</p>
            <button
                onClick={onClick}
                className="bg-blue-200 hover:bg-yellow-dark-yellow text-gray-800 font-bold py-1 px-1 rounded-full inline-flex items-center transition duration-300"
            >
            <svg viewBox="0 0 32 32"
                className={arrowStyle}
                aria-hidden="true"
            >
                <path d="M26.025 14.496l-14.286-.001 6.366-6.366L15.979 6 5.975 16.003 15.971 26l2.129-2.129-6.367-6.366h14.29z"/>
            </svg>

            </button>
        </div>
    );
}

export default function ProfileSelector(props: ProfileSelectorSpec): JSX.Element {

    const socket = useSocket();

    const faceTypes = Object.values(FaceType);
    const bodyColors = Object.values(BodyColor);
    const rubberColors = Object.values(RubberColor);
	const [, setProfileStorage] = useLocalStorage<IProfile>(LocalStorageKey.Profile)

    const [isStartEnabled, setIsStartEnabled] = useState(true);

    useEffect(() => {
	setIsStartEnabled(props.profile.username.length >= 3);
    }, [props.profile]);

    const randomizeAvatar = () => {
        socket.emit("randomize-avatar", (profile: IProfile) => {
            setProfileStorage(profile)
        });
    }

    const setUsername = (username: string) => props.setProfile({...props.profile, username})
    const setRubberColor = (rubberColor: RubberColor) => props.setProfile({...props.profile, ...{avatar: {...props.profile.avatar, rubberColor}}})
    const setBodyColor = (bodyColor: BodyColor) => props.setProfile({...props.profile, ...{avatar: {...props.profile.avatar, bodyColor}}})
    const setFaceType = (faceType: FaceType) => props.setProfile({...props.profile, ...{avatar: {...props.profile.avatar, faceType}}})
    
    return (
		<div>
			<SectionTitle subtitle="Hey there !" hintColor="text-yellow-light-yellow">WHO ARE YOU ?</SectionTitle>
			<div className="bg-blue-darker-blue rounded-md p-4 pt-2 md:max-w-xs">
				<Title>Avatar</Title>
				<div className="mt-4 grid grid-cols-3 grid-flow-col auto-cols-min">
					<div className="flexflex-col justify-between">
						<SelectButton<RubberColor> direction="left" name="Eraser" value={props.profile.avatar.rubberColor} list={rubberColors} setValue={(v) => setRubberColor(v)}/>
						<SelectButton<BodyColor> direction="left" name="Color" value={props.profile.avatar.bodyColor} list={bodyColors} setValue={(v) => setBodyColor(v)}/>
						<SelectButton<FaceType> direction="left" name="Face" value={props.profile.avatar.faceType} list={faceTypes} setValue={(v) => setFaceType(v)}/>
					</div>

					<div className="flex items-center">
						<Avatar avatar={props.profile.avatar}/>
					</div>

					<div className="flex flex-col justify-between">
						<SelectButton<RubberColor> direction="right" name="Eraser" value={props.profile.avatar.rubberColor} list={rubberColors} setValue={(v) => setRubberColor(v)}/>
						<SelectButton<BodyColor> direction="right" name="Color" value={props.profile.avatar.bodyColor} list={bodyColors} setValue={(v) => setBodyColor(v)}/>
						<SelectButton<FaceType> direction="right" name="Face" value={props.profile.avatar.faceType} list={faceTypes} setValue={(v) => setFaceType(v)}/>
					</div>
				</div>

				<div className="mt-4">
                    <Button className="mt-2" disabled={!isStartEnabled} onClick={randomizeAvatar}>Randomize</Button>
					<Title>Pseudo</Title>
					<form onSubmit={(e) => {
                        e.preventDefault();
                            props.handleStart();
                        }}>
                        <input className="bg-blue-200 w-full border-2 rounded border-yellow-light-yellow pl-2 text-white-white" type="text" value={props.profile.username} onChange={(e) => setUsername(e.target.value)} />
                        <Button className="mt-2" disabled={!isStartEnabled} type="submit">Done !</Button>
                    </form>
				</div>
			</div>
		</div>
    )
    
}
