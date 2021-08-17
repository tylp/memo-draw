import { Dispatch, SetStateAction } from "react";

export interface SelectButtonSpec<T> {
    name?: string,
    setValue: Dispatch<SetStateAction<T>>,
    value: T,
    list: T[],
    direction: 'left'|'right'
}

export interface IProfileSelector {
    username: string;
    handleStart;
    handleUserName;
}
