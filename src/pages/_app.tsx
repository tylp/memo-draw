import React from 'react';
import { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css'
// import '../components/styles/board.css'

function MemoDraw({Component, pageProps} : AppProps) : React.ReactNode {
    return <Component {...pageProps} />
}

export default MemoDraw;