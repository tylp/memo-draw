import React from 'react';
import { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css'

function MemoDraw({Component, pageProps} : AppProps): JSX.Element {
    return <Component {...pageProps} />
}

export default MemoDraw;