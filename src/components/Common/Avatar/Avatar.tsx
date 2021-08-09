import React, { useEffect, useState } from 'react';
import { BodyColor, BodyType } from '../../../../server/interfaces/IProfile';

import AvatarService from '../../../services/AvatarService';

import { IAvatar, IBody, IFace } from './Avatar.spec';

export default function Avatar(props: IAvatar): JSX.Element {

    return (
        <div className="rounded-full border-2 border-yellow-dark-yellow bg-blue-200">
            <svg width="100%" height="100%" viewBox="-100 -100 200 200" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <Body type={props.bodyType} color={props.bodyColor} />
                <Face type={props.faceType} />
            </svg>
        </div>
    );
}


function Body (props: IBody) {
    const avatarBody = AvatarService.getBody(props.type);

    {/*<image x="-95" y="-100" width="95%" height="95%" href={body.src} />*/}

    return (
        <object type="image/svg+xml" data={avatarBody.src} width="95%" height="95%"></object>
    );
}

const Face = (props: IFace) => {
    const faceType = AvatarService.getFaceType(props.type);

    return (
        <image x="-95" y="-100" width="95%" height="95%" href={faceType.default.src} />
    );
}
