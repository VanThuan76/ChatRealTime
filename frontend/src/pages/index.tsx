import { type NextPage } from "next";
import Head from "next/head";
import { useQuery } from "react-query";
import { userService } from "~/shared/servers/user.service";
import { GetServerSideProps } from 'next';
import io from "socket.io-client";
import { Avatar, Button, Card, Divider, Form, Input, Layout, List, Select, Skeleton, Space } from "antd";
import SiderMenu from "~/shared/layouts/components/SiderMenu";
import SiderChat from "~/shared/layouts/components/SiderChat";
import { Content } from "antd/lib/layout/layout";
import { AudioOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const {Option} = Select

type Props = {
  // Define the type for the props that will be passed to the page component
};
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps:GetServerSideProps<Props> = async (context) => {
  const { isAuthenticated } = context.req.cookies;

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {}
  };
}
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1890ff',
    }}
  />
);
const Home: NextPage = () => {
  const { data, isFetched } = useQuery("listUser", () => userService.getListUser(), {
    select(data) {
      return data.data
    },
  })
  const [form] = Form.useForm();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [roomId, setRoomId] = useState()
  const loadMoreData = () => {
    return
  }
  const socket = io('http://localhost:3076',{ transports : ['websocket']})
  useEffect(() => {
        socket.on("new message", message => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
            setMessages((prevMessages:any) => [...prevMessages, message]);
        });
        return () => {
        socket.close();
        };
    }, [message]);
    const handleMessage = (value:{message: string}) => {
        console.log("RUN")
        socket.emit("send message", value.message);
        form.resetFields();
    };
    const selectBefore = (
    <Select style={{minHeight: "100%"}} defaultValue="SMS">
      <Option value="SMS">SMS</Option>
      <Option value="Voice">Voice</Option>
    </Select>
  );
  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Chat App vanthuan76" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout style={{ minHeight: '100vh' }}>
            <SiderMenu/>
            {isFetched && <SiderChat data={data} setRoomId={setRoomId}/>}
            {
              roomId &&
            <Layout style={{ padding: '0 12px 12px' }}>
                <Content style={{ margin: '24px 0 0' }}>
                    <div style={{ padding: 24, minHeight: 360, backgroundColor: "#fff", borderRadius: 10 }}>
                      <Form style={{minHeight: "600px", backgroundColor: "#C0DBEA", position: "relative", borderRadius: 10}}
                        form={form}
                        onFinish={handleMessage}
                        autoComplete="off"
                        name="basic"
                        scrollToFirstError={true}
                      >
                        <Card>Message</Card>

                        {/* Box CHAT */}
                        {
                          messages && 
                            <div
                              id="scrollableDiv"
                              style={{
                              height: 450,
                              overflow: 'auto',
                              padding: '0 16px',
                              }}
                            >
                            <InfiniteScroll
                                dataLength={messages.length}
                                next={loadMoreData}
                                hasMore={messages.length < 50}
                                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                scrollableTarget="scrollableDiv"
                            >
                                <List
                                  itemLayout="horizontal"
                                  dataSource={messages}
                                  renderItem={(item, index) => (
                                  <List.Item style={{margin: "0 12px"}}>
                                      <List.Item.Meta
                                      avatar={<Avatar src={`https://joesch.moe/api/v1/random?key=${index}`} />}
                                      title={"Test"}
                                      description={messages.map(message => message)[messages.length - 1]}
                                  />
                                  </List.Item>
                                  )}
                                  />
                            </InfiniteScroll>
                            </div>
                        }

                        {/* SEND MESSAGE */}
                        <Space.Compact 
                        style={{
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          width: '80%', 
                          backgroundColor: "#fff",
                          borderRadius: 10, 
                          bottom: 10,
                          left: 70,
                        }}>
                            <Form.Item style={{width: "100%",margin: 0}} name="message"> 
                              <Input value={message} size="large" bordered={false} addonBefore={selectBefore} allowClear maxLength={50} suffix={suffix}/>
                            </Form.Item>
                            <Button htmlType="submit" style={{borderStyle: "none", textAlign: "center"}}>
                              <SendOutlined />
                            </Button>
                        </Space.Compact>
                      </Form>
                    </div>
                </Content>
            </Layout>
            }
        </Layout>
    </>
  );
};

export default Home;
