import { ReactNode } from "react";

export interface IButton {
    children: ReactNode,
    className?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
}