import { ReactNode } from "react";
import { ButtonHTMLAttributes } from "react";

export interface IButton {
    children: ReactNode,
    className?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
    type?: 'submit' | 'reset' | 'button',
}
