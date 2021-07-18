export interface SelectButtonSpec {
    name?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    direction: 'left'|'right'
}