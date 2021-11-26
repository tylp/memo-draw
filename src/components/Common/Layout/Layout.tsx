import React, { ReactNode } from 'react';

import styles from '../../../../styles/Layout.module.css';

interface LayoutSpec {
	children: ReactNode
}

export default function Layout({ children }: LayoutSpec): JSX.Element {
	return (
		<div className="bg-gradient-to-r from-blue-blue to-blue-light-blue min-h-screen">
			<div className="flex items-center justify-center min-h-screen">
				<div className={styles['container']}>
					<div style={{ position: 'relative' }}>
						<img
							className={styles['logo']}
							src="/img/logo.svg"
							alt="Memo Draw"
						/>
					</div>
					<main className={styles['main']}>
						{children}
					</main>
				</div>
			</div>
		</div>
	)
}