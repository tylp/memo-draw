import React from 'react';
import { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css'

function MemoDraw({Component, pageProps} : AppProps) : React.ReactNode {
    return <Component {...pageProps} />
}

export default MemoDraw;