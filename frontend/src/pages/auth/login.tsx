import React, { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Form, Input, message } from 'antd';
import BlankLayout from '~/shared/layouts/BlankLayout';
import Head from 'next/head';
import { useMutation } from 'react-query';
import { authService } from '~/shared/servers/auth.service';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { login } from '~/shared/store/appSlice';
import { useDispatch } from 'react-redux';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';

const Login = ({}) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_DEFAULT}`,{ transports : ['websocket']});
    const loginMutation = useMutation({
        mutationKey: 'login',
        mutationFn: (body: { email: string, password: string }) => authService.authenticated(body),
        onSuccess(data, _variables, _context) {
            if (data.data){
                setCookie('isAuthenticated', true)
                setCookie('dataUser', data.data)
                dispatch(login(data.data))
                router.push("/")
                message.success(
                    'Đăng nhập thành công',
                );
            }
        },
        onError(error, variables, context) {
             message.error(
                'Đăng nhập không thành công',
            );
        },
    })
    const handleLogin = (values: {email: string, password:string}) => {
        loginMutation.mutate(values)
        socket.emit('login', values.email)
    };
    useEffect(() => {
        const auth = getCookie('isAuthenticated')
        const dataUser = getCookie('dataUser')
        if(auth && typeof dataUser === "string"){
            const dataJsonParse = JSON.parse(dataUser)
            dispatch(login(dataJsonParse))
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
                name="normal_login"
                style={{width: "100%"}}
                initialValues={{ remember: true }}
                onFinish={handleLogin}
                autoComplete="off"
            >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a style={{float: "right"}}
                onClick={() =>
                     router.push(
                    {
                        pathname: '/auth/[auth]',
                        query: {auth: "forgot_password"},
                    }
                    )}>
                 Forgot password
                </a>
            </Form.Item>
            <Form.Item>
                <Button style={{color: "#000", width: "100%"}} type="primary" htmlType="submit">
                    Submit
                </Button>
                Or <a onClick={() => router.push("/auth/register")}>register now!</a>
            </Form.Item>
            </Form>
        </Card>
  </>
)};
Login.getLayout = (children: React.ReactNode) => <BlankLayout>{children}</BlankLayout>
export default Login;