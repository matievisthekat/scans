import '../styles/globals.scss';
import '../styles/AnswerOptions.scss';
import '../styles/Scan.scss';
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
