import React, { useEffect } from 'react';

import AvatarService from '../../../services/AvatarService';

import { IAvatar, IBody, IFace } from './Avatar.spec';

export default function Avatar(props: IAvatar): JSX.Element {

    const avatarOfPlayerId = props.playerId ? `avatarOfPlayerId${props.playerId}` : 'avatar';

    const updateColor = (elementToUpdate: string, value) => {
        const avatarElement : any = document.getElementById(avatarOfPlayerId);
        if(typeof document !== 'undefined' && avatarElement && avatarElement.contentDocument) {
            const paintableElement = avatarElement.contentDocument.getElementById(elementToUpdate);
            if(paintableElement)
                paintableElement.style.fill = value;
        }
    }

    useEffect(() => {
        console.log(`rubber = ${props.rubberColor} & color = ${props.bodyColor}`)
        updateColor('eraser-paint', props.rubberColor);
        updateColor('avatar-body-paint', props.bodyColor);
    }, [])

    useEffect(() => {
        updateColor('eraser-paint', props.rubberColor);
    }, [props.rubberColor]);
    
    useEffect(() => {
        updateColor('avatar-body-paint', props.bodyColor);
    }, [props.bodyColor]);

    return (
        <div className="rounded-full border-2 border-yellow-dark-yellow bg-blue-200 relative">
            <AvatarBody playerId={avatarOfPlayerId} type={props.bodyType} color={props.bodyColor} />
            <AvatarFace type={props.faceType}/>
        </div>
    );
}

const AvatarBody = (props: IBody) => {
    const avatarBody = AvatarService.getBody(props.type);
    return (
        <object id={props.playerId} data={avatarBody.default.src} type="image/svg+xml" width="100" height="100" className="relative bottom-0.5"></object>
    );
}

const AvatarFace = (props: IFace) => {
    const faceType = AvatarService.getFaceType(props.type);

    return (
        <img width="100" height="100" src={faceType.default.src} className="absolute top-0"/>
    );
}
