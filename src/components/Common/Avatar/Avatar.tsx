import React, { useEffect, useState } from 'react';
import { IAvatar } from './Avatar.spec';
import MainAvatar from '../../../avatars/body/pencil.svg';

import AvatarService from '../../../services/AvatarService';

export default function Avatar(props: IAvatar): JSX.Element {

    const faceType = AvatarService.getFaceType(props.faceType);
    const bodyColor = AvatarService.getBody(props.bodyColor);

    return(
        <>
            <img className="rounded-full border-2 border-yellow-dark-yellow bg-blue-200" src={faceType.default.src}/>
        </>
    )
}