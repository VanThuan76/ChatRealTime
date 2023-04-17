import React from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import Head from 'next/head';
import BlankLayout from '~/shared/layouts/BlankLayout';
import { validateEmail } from '~/shared/utils/formValidator';
import { useMutation } from 'react-query';
import { userService } from '~/shared/servers/user.service';
import { ICreateUser } from '~/shared/typeDef/user.type';
import { useRouter } from 'next/router';

const Register = ({}) => {
    const router = useRouter()
    const registerMutation = useMutation({
        mutationKey: 'login',
        mutationFn: (body: ICreateUser) => userService.createUser(body),
        onSuccess(data, _variables, _context) {
            if (data) {
                router.push("/")
                message.success(
                    'Đăng ký thành công',
                );
            }
        },
        onError(_error, _variables, _context) {
             message.error(
                'Đăng ký không thành công',
            );
        },
    })
  const onFinish = (values: any) => {
    const bodyRegister = {
        name: values.name,
        email: values.email,
        username: values.username,
        password: values.password
    }
    registerMutation.mutate(bodyRegister)
  };

  return (
    <>
     <Head>
        <title>Register Chat</title>
    </Head>
     <Card
        title="Register Chat"
        style={{ minWidth: 400 }}
    >
    <Form
      name="normal_register"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item
        label="Nick Name"
        name="name"
        rules={[{ required: true, message: 'Please input your Name!' }]}
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{...validateEmail()}]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item
        label="Password Confirm"
        name="password_confirm"
        rules={[
            { required: true, message: 'Please confirm your password!' }
            ,
            ({ getFieldValue }) => ({
            validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
            })
        ]}
      >
        <Input
          type="password"
          placeholder="Password Confirm"
        />
      </Form.Item>
      <Form.Item>
        <Button style={{color: "#000", width: "100%"}} type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
    </Card>
    </>
  );
};
Register.getLayout = (children: React.ReactNode) => <BlankLayout>{children}</BlankLayout>
export default Register;