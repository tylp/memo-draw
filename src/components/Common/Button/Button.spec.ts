import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { ReactNode } from 'react';

export interface ButtonSpec {
    children: ReactNode,
    className?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
    type?: 'submit' | 'reset' | 'button',
    size: 'small' | 'normal',
    color: 'primary' | 'secondary',
    icon?: IconDefinition
}
