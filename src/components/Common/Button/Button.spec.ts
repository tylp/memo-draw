import { ReactNode } from 'react';

export interface ButtonSpec {
	children: ReactNode,
	className?: string,
	onClick?: React.MouseEventHandler<HTMLButtonElement>,
	disabled?: boolean,
	type?: 'submit' | 'reset' | 'button',
}
