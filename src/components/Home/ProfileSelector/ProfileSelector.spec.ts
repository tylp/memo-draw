import { Dispatch, SetStateAction } from 'react';
import IProfile from '../../../../server/interfaces/IProfile';

export interface SelectButtonSpec<T> {
    name?: string,
    setValue: (v: T) => void,
    value: T,
    list: T[],
    direction: 'left'|'right'
}

export interface ProfileSelectorSpec {
    profile: IProfile;
    setProfile: Dispatch<SetStateAction<IProfile>>;
    socket: SocketIOClient.Socket;
}
