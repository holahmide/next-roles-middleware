import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { GlobalContextProvider } from '../context';
import AuthGuard from '../components/AuthGuard';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </GlobalContextProvider>
  );
}

export default MyApp;
