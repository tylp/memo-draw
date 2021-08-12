import React, { useEffect, useState } from 'react';

import AvatarService from '../../../services/AvatarService';
import IdGeneratorService from '../../../../server/services/IdGeneratorService';

import { IAvatar, IBody, IFace } from './Avatar.spec';

export default function Avatar(props: IAvatar): JSX.Element {

    const [avatarId, setAvatarId] = useState(IdGeneratorService.generate());

    const updateColor = (elementToUpdate: string, value) => {
        const avatarElement : any = document.getElementById(avatarId);
        if(typeof document !== 'undefined' && avatarElement && avatarElement.contentDocument) {
            const paintableElement = avatarElement.contentDocument.getElementById(elementToUpdate);
            if(paintableElement)
                paintableElement.style.fill = value;
        }
    }

    useEffect(() => {
        const arm = document.getElementById(avatarId);
        arm.addEventListener('load', function(){
            updateColor('eraser-paint', props.rubberColor);
            updateColor('avatar-body-paint', props.bodyColor);
        });
    }, [])

    useEffect(() => {
        updateColor('eraser-paint', props.rubberColor);
    }, [props.rubberColor]);
    
    useEffect(() => {
        updateColor('avatar-body-paint', props.bodyColor);
    }, [props.bodyColor]);

    return (
        <div className="w-full rounded-full border-2 border-yellow-dark-yellow bg-blue-200 relative">
            <AvatarBody playerId={avatarId} type={props.bodyType} color={props.bodyColor} />
            <AvatarFace type={props.faceType}/>
        </div>
    );
}

const AvatarBody = (props: IBody) => {
    const avatarBody = AvatarService.getBody(props.type);
    return (
        <object id={props.playerId} data={avatarBody.default.src} type="image/svg+xml" className="relative bottom-0.5"></object>
    );
}

const AvatarFace = (props: IFace) => {
    const faceType = AvatarService.getFaceType(props.type);

    return (
        <img src={faceType.default.src} className="absolute top-0"/>
    );
}
