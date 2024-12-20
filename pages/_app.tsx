import "dotenv/config";
import "@mantine/core/styles.css";

import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme";
import { Header } from "../components/header";

export default function App({ Component, pageProps }: any) {
  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>Github Repo Sponsor</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </MantineProvider>
  );
}
