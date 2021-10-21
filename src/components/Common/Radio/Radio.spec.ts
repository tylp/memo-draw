import { ReactNode } from 'react';

export interface RadioSpec {
    className?: string,
    size: 'small' | 'medium' | 'big',
    color: 'primary' | 'secondary' | 'light-secondary',
}