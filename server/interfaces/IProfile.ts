import { IAvatar } from '../../src/components/Common/Avatar/Avatar.spec';

export default interface IProfile {
    username: string,
    avatar: IAvatar,
}

export enum RubberColor {
    Pink = '#FF7BAC',
    Blue = '#7BA8FF',
}

export enum BodyType {
    Pencil = 'Pencil.svg',
}

export enum BodyColor {
    Yellow = '#FFE500',
    Red = '#FF2626',
    Orange = '#FF7E35',
    LightGreen = '#B3FF38',
    Green = '#009518',
    Blue = '#514EFF',
    Teal = '#3DF3FF',
    Purple = '#BD00FF',
    Pink = '#FF70F9',
    White = '#F2F2F2',
}

export enum FaceType {
    Happy = 'Happy.svg',
    Sad = 'Sad.svg',
    Angry = 'Angry.svg',
    Surprised = 'Surprised.svg',
    Neutral = 'Neutral.svg',
    Cyclops = 'Cyclops.svg',
    Astonished = 'Astonished.svg',
    High = 'High.svg',
    Meh = 'Meh.svg',
    Triclops = 'Triclops.svg',
}