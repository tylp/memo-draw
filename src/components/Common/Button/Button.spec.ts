import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { ReactNode } from 'react';

export interface ButtonSpec {
    children: ReactNode,
    className?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
    size: 'small' | 'medium' | 'big',
    color: 'primary' | 'secondary' | 'light-secondary',
    icon?: IconDefinition
}
