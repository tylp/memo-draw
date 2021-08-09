import React, { useEffect, useState } from 'react';
import { BodyColor, BodyType } from '../../../../server/interfaces/IProfile';

import AvatarService from '../../../services/AvatarService';

import { IAvatar, IBody, IFace } from './Avatar.spec';

export default function Avatar(props: IAvatar): JSX.Element {

    return (
        <div className="rounded-full border-2 border-yellow-dark-yellow bg-blue-200 relative">
            <AvatarBody type={props.bodyType} color={props.bodyColor} />
            <AvatarFace type={props.faceType}/>
        </div>
    );
}

const AvatarBody = (props: IBody) => {
    const avatarBody = AvatarService.getBody(props.type);

    return (
        <object data={avatarBody.default.src} type="image/svg+xml" width="100" height="100" className="relative bottom-0.5"></object>
    );
}

const AvatarFace = (props: IFace) => {
    const faceType = AvatarService.getFaceType(props.type);

    return (
        <img width="100" height="100" src={faceType.default.src} className="absolute top-0 left-0"/>
    );
}
