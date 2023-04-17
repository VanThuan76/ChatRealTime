// ** React Imports
import BlankLayout from '~/shared/layouts/BlankLayout'
import { Button, Result } from 'antd'
import Head from 'next/head'
import Link from 'next/link'


const Error404 = () => {
  return (
    <>
      <Head>
        <title>Page Not Found</title>
      </Head>
      <Result
        status="404"
        title="404"
        subTitle="Page Not Found"
        extra={<Button type="primary"><Link href={"/"}>{"Go Home"}</Link> </Button>}
      />
    </>

  )
}
Error404.getLayout = (children: React.ReactNode) => <BlankLayout>{children}</BlankLayout>
export default Error404
