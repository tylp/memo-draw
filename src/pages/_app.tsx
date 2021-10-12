import React from 'react';
import { AppProps } from 'next/app';
import '../../styles/globals.css';

function MemoDraw({ Component, pageProps }: AppProps): JSX.Element {
	return typeof window === 'undefined' ? null : <Component {...pageProps} />
}

export default MemoDraw;