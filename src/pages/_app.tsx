import React from 'react';
import { AppProps } from 'next/app';
import '../../styles/index.css';
import '../i18n';

function MemoDraw({ Component, pageProps }: AppProps): JSX.Element {
	return (
		<div className="bg-gradient-to-r from-blue-blue to-blue-light-blue" suppressHydrationWarning >
			{typeof window === 'undefined' ? null : <Component {...pageProps} />}
		</div>
	)
}

export default MemoDraw;