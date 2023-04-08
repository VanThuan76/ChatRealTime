import type { NextPage } from 'next';
import { type AppType } from "next/app";
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import "~/styles/globals.css";
import DashboardLayout from "~/shared/layouts/DashboardLayout";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 2 } } });

const MyApp: AppType = ({ Component, pageProps }:AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DashboardLayout>{page}</DashboardLayout>)

  return (
    <>
    <Head>
      <title>T3 Stack Chat</title>
    </Head>
    <QueryClientProvider client={queryClient}>
     {getLayout(<Component {...pageProps} />)}
    </QueryClientProvider>
    </>
  )
};

export default MyApp;
