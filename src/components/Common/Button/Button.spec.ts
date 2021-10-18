import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { ReactNode } from 'react';

export interface ButtonSpec {
    children: ReactNode,
    className?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
    size: 'small' | 'medium',
    color: 'primary' | 'secondary',
    icon?: IconDefinition
}
