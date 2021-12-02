import React, { ReactNode } from 'react';

import styles from '../../../../styles/Layout.module.css';

interface LayoutSpec {
	children: ReactNode,
	size?: 'normal' | 'large',
}

export default function Layout({ children, size = 'normal' }: LayoutSpec): JSX.Element {
	return (
		<div className="bg-gradient-to-r from-blue-blue to-blue-light-blue min-h-screen">
			<div className="flex items-center justify-center min-h-screen">
				<div className={`${styles['container']} ${size === 'large' && styles['large']}`}>
					<img
						className={styles['logo']}
						src="/img/logo.svg"
						alt="Memo Draw"
					/>
					<div className={styles['border-top-right']} />
					<div className={styles['border-top-left']} />
					<main className={styles['main']}>
						{children}
					</main>
				</div>
			</div>
		</div>
	)
}