import React, { useEffect } from 'react';
import { Button, Card, Checkbox, Form, Input, message } from 'antd';
import BlankLayout from '~/shared/layouts/BlankLayout';
import Head from 'next/head';
import { useMutation } from 'react-query';
import { authService } from '~/shared/servers/auth.service';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';

const Login = ({}) => {
    const router = useRouter()
    const loginMutation = useMutation({
        mutationKey: 'login',
        mutationFn: (body: { email: string, password: string }) => authService.authenticated(body),
        onSuccess(data, _variables, _context) {
            if (data) {
                setCookie('isAuthenticated', true)
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                router.push("/")
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                message.success(
                    'Đăng nhập thành công',
                );
            }
        },
        onError(error, variables, context) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
             message.error(
                'Đăng nhập không thành công',
            );
        },
    })
    const handleLogin = (values: {email: string, password:string}) => {
        loginMutation.mutate(values)
    };
    useEffect(() => {
        const auth = getCookie('isAuthenticated')
        if(auth){
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            router.push("/")
        }
    },[])
    return (
    <>
        <Head>
             <title>Login Chat</title>
        </Head>
        <Card
            title="Login Chat"
            style={{ minWidth: 400 }}
        >
            <Form
                name="basic"
                layout='vertical'
                initialValues={{ remember: true }}
                onFinish={handleLogin}
                autoComplete="off"
            >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button style={{color: "#000"}} type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
            </Form>
        </Card>
  </>
)};
Login.getLayout = (children: React.ReactNode) => <BlankLayout>{children}</BlankLayout>
export default Login;