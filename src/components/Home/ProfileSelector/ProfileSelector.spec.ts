export interface SelectButtonSpec {
    name?: string,
    setValue: any,
    value: any,
    list: any,
    direction: 'left'|'right'
}

export interface IProfileSelector {
    username: string;
    handleStart;
    handleUserName;
}
