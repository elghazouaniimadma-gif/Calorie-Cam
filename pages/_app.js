import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
