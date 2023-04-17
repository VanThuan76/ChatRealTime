import type { NextPage } from 'next';
import { type AppType } from "next/app";
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import "~/styles/globals.css";
import DashboardLayout from "~/shared/layouts/DashboardLayout";
import { Provider } from 'react-redux';
import { store } from '~/shared/store/store';
import { ConfigProvider } from 'antd';
import { APP_THEME } from '~/shared/constant/AppConstant';
import useTheme from '~/shared/hooks/useTheme';


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 2 } } });
const ThemeApp = ({ children, getLayout }: { children: React.ReactElement, getLayout: (page: ReactElement) => ReactNode }) => {
    const { theme } = useTheme()
    return (
      <ConfigProvider theme={APP_THEME.theme[theme]}>
        {getLayout(children)}
      </ConfigProvider>
    )
};

const MyApp: AppType = ({ Component, pageProps }:AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DashboardLayout>{page}</DashboardLayout>)
  return (
    <>
    <Head>
      <title>T3 Stack Chat</title>
    </Head>
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeApp getLayout={getLayout}>
          <Component {...pageProps} />
      </ThemeApp>
    </QueryClientProvider>
    </Provider>
    </>
  )
};

export default MyApp;
