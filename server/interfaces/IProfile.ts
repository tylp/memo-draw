export default interface IProfile {
    username: string,
    rubberColor: RubberColor,
    bodyColor: BodyColor,
    faceType: FaceType,
}

export enum RubberColor {
    Pink,
    Blue,
}

export enum BodyColor {
    Yellow,
    Red,
    Orange,
    LightGreen,
    Green,
    Blue,
    Teal,
    Purple,
    Pink,
    White,
}

export enum FaceType {
    Happy,
    Sad,
    Angry,
    Surprised,
    Neutral,
    Cyclops,
    Astonished,
    High,
    Meh,
    Triclops,
}