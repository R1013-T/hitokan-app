import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500&display=swap"
          rel="stylesheet"
        />
        <meta charSet="UTF-8" />
        <meta http-equiv="content-language" content="ja" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>HitokanApp</title>
        <meta
          name="description"
          content="人間関係を簡単に管理。もう知り合いのことを忘れません。社会に出て拡大した人間関係を管理するWebアプリ。"
        />
        <meta name="keywords" content="HITOKAN,ヒトカン,hitokan,hitokan-app,HitokanApp,人間関係,管理,人" />
        <meta property="og:title" content="HitokanApp" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hitokan-app.tokyo" />
        <meta
          property="og:description"
          content="人間関係を簡単に管理。もう知り合いのことを忘れません。"
        />
        <meta property="og:site_name" content="ヒトカン" />
        <meta
          property="og:image"
          content="https://hitokan-app.tokyo/images/hitokan-Image.png"
        />
        <meta
          name="subject"
          content="社会に出て拡大した人間関係を管理するWebアプリ。"
        />
        <meta name="author" content="Welnald" />
        <link rel="start" href="https://hitokan-app.tokyo" />
        <meta name="Targeted Geographic Area" content="Japan" />
        <meta name="distribution" content="Local" />
        <meta name="coverage" content="Japan" />
        <meta name="classification" content="管理" />
        <meta name="robots" content="INDEX,FOLLOW" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
