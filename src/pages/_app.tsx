import React from 'react';
import { AppProps } from 'next/app';
import '../../styles/globals.css';
import '../i18n';

function MemoDraw({ Component, pageProps }: AppProps): JSX.Element {
	return (
		<div suppressHydrationWarning>
			{typeof window === 'undefined' ? null : <Component {...pageProps} />}
		</div>
	)
}

export default MemoDraw;