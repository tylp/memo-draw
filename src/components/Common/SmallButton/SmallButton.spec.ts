import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { ReactNode } from "react";

export interface SmallButtonSpec {
    children: ReactNode,
    className?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
    type?: 'submit' | 'reset' | 'button',
	bgColor: string,
	color: string,
	icon?: IconDefinition
}
