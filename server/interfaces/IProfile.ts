export default interface IProfile {
    username: string,
    rubberColor: RubberColor,
    bodyColor: BodyColor,
    faceType: FaceType,
}

export enum RubberColor {
    Pink = "#FF7BAC",
    Blue = "#7BA8FF",
}

export enum BodyColor {
    Yellow = "#FFE500",
    Red = "#FF2626",
    Orange = "#FF7E35",
    LightGreen = "#B3FF38",
    Green = "#009518",
    Blue = "#514EFF",
    Teal = "#3DF3FF",
    Purple = "#BD00FF",
    Pink = "#FF70F9",
    White = "#F2F2F2",
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