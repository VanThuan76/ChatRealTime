import {  FileImageOutlined, MoreOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Form, List, Row, Skeleton, Space, Input, Button, Select, Typography, theme, Tooltip, FormInstance } from "antd";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMutation, useQuery } from "react-query";
import { io } from "socket.io-client";
import { useAppSelector } from "src/shared/hooks/useRedux";
import { messageService } from "../servers/message.service";
import { conversationService } from "../servers/conversation.service";
import { arrangeListMessage, validateTime } from "../utils/formValidator";
import { userService } from "../servers/user.service";
import { IMessageNew } from "../typeDef/message.type";
import { useDispatch } from "react-redux";
import { setCurrentConversationIdChat } from "../store/appSlice";
import { setCookie } from "cookies-next";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface Props{
    currentUserIdChat: number
}
const BoxChat = ({currentUserIdChat}: Props) => {
const [form] = Form.useForm();
const listRef = useRef<any>(null);
const [emoji, setEmoji] = useState(null);
const [trigger, setTrigger] = useState(false);
const [socket, setSocket] = useState(io(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_DEFAULT}`,{ transports : ['websocket']}));
const [messages, setMessages] = useState<string[]>([]);
const [isChanged, setIsChanged] = useState<boolean>(false)
const {dataUser, currentConversationIdChat} = useAppSelector((state) => state.appSlice)
const { token } = theme.useToken();
const dataUserChat: any = messages.find((item:any) => item.user.id !== dataUser?.id)
const dispatch = useDispatch()
const handleSelectEmoji = (e:any) => {
    setEmoji(e.native);
    setTrigger(!trigger)
};
const suffix = (
    <Row gutter={16} align="middle">
       <Col style={{ height: 48, display: "flex", alignItems: "center" }}>
            <Tooltip open={trigger} color={"transparent"} title={ <Picker previewPosition={top} data={data} onEmojiSelect={(e:any) => handleSelectEmoji(e)} /> }>
                <SmileOutlined onClick={() => setTrigger(!trigger)} style={{fontSize: 16, color: '#1890ff'}}/>
            </Tooltip>
       </Col>
       <Col style={{ height: 48, display: "flex", alignItems: "center" }}> 
            <FileImageOutlined style={{fontSize: 16, color: '#1890ff'}}/>
       </Col>
       <Col style={{ height: 48, display: "flex", alignItems: "center" }}>
            <Button htmlType="submit" style={{ borderStyle: "none", textAlign: "center"}}>
                <SendOutlined style={{ fontSize: 16, color: '#1890ff'}}/>
            </Button>
       </Col>
    </Row>
);
// const [conversationIdGet, setConversationIdGet] = useState<number>()
// useQuery(["conversation", roomId], () => conversationService.getConversation({conversationId: roomId}), {
//     select(data:any) {
//     return data.data.participants
//     },
//     onSuccess(data) {
//         const filterUser = data.find((item:any) => item.user.name !== dataUser?.name)
//         setUserConversation(filterUser.conversationId)
//     },
// })
// console.log(userConversation)
const { data: dataMessCurrent } = useQuery(["dataMessCurrent", currentUserIdChat], () => messageService.getMessage({senderId: dataUser?.id!}), {
    select(data:any) {
    return data.data
    }
})
const { data: messageSend } = useQuery(["messageSend", currentUserIdChat], () => messageService.getMessage({senderId: currentUserIdChat!}), {
    select(data:any) {
    return data.data
    },
    onSuccess(data) {  
    const messageSend: any = data.filter((innerArray:any) => {
        const conversationCurrent = dataMessCurrent.find((item:any) => item.conversationId === innerArray.conversationId)
        return conversationCurrent
    })
    const conversationId = messageSend.find((item:any) => item.conversationId)
    const currentConversationIdChat = dispatch(setCurrentConversationIdChat(conversationId.conversationId))  
    setCookie("currentConversationIdChat", currentConversationIdChat)
    setMessages((prevMessages) => [
        ...prevMessages,
        ...messageSend.map((mes:any) => {
            return {
            message: mes.body,
            time: mes.createdAt,
            user: mes.sender
        }
    })])
    },
    enabled: !!currentUserIdChat && !!dataMessCurrent
})
const { data: messageGet } = useQuery(["messageGet", currentUserIdChat], () => messageService.getMessage({senderId: dataUser?.id!}), {
    select(data:any) {
    return data.data
    },
    onSuccess(data) {  
        if(messageSend){
        const messageGet: any = data.filter((innerArray:any) => {
            const conversationCurrent = messageSend.find((item:any) => item.conversationId === innerArray.conversationId)
            return conversationCurrent
        })
        setMessages((prevMessages) => [
            ...prevMessages,
            ...messageGet.map((mes:any) => {
                return {
                message: mes.body,
                time: mes.createdAt,
                user: mes.sender
            }
        })])}
    },
    enabled: !!currentUserIdChat  && !!messageSend
})
const createMutation = useMutation({
    mutationKey: ['createMessage'],
    mutationFn: (body: IMessageNew) => messageService.newMessage(body),
})
const loadMoreData = () => {
    return
}
  useEffect(() => {
        setMessages([])
        socket.on("new message", message => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            socket.off('new message');
        };
    }, [currentUserIdChat]);
const handleMessage = (value:{message: string}) => {
    const formCreate = {
        newMessage: value.message as string,
        conversationId: currentConversationIdChat,
        senderId: dataUser?.id as number
    }
    createMutation.mutate(formCreate)
    setIsChanged(false)
    socket.emit("send message", {message: value.message, user: dataUser});
    form.resetFields();
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
};
    return (  
        <>
        <Form style={{minHeight: "600px", backgroundColor: token.colorBgLayout, position: "relative", borderRadius: 10}}
            form={form}
            onFinish={handleMessage}
            autoComplete="off"
            name="basic"
            scrollToFirstError={true}
        >
        <Card style={{position: "absolute", top: 0, left:0, width: "100%", opacity: 0.7, backdropFilter: "blur(10px)", zIndex: "10", backgroundBlendMode: "lighten"}}>
            <div className="text-2xl flex items-center justify-start">
                <Avatar className="block m-2 max-w-[32px] max-h-[32px] rounded-[50px]" alt="userIcon" src={`${dataUserChat?.user.image}`} />
                <Typography>{dataUserChat?.user.username}</Typography>
                <MoreOutlined style={{fontSize: "18px", position: "absolute", right: 10}} />
            </div>
        </Card>
        {
             messages && messageGet && messageSend &&
             <>
                <div id="scrollableDiv" style={{height: 450, overflow: 'auto', padding: '0 16px'}}>
                    <InfiniteScroll
                        ref={listRef}
                        dataLength={messages.length}
                        next={loadMoreData}
                        hasMore={messages.length < 50}
                        loader={isChanged && <Skeleton avatar paragraph={{ rows: 1 }} active />}
                        scrollableTarget="scrollableDiv"
                    >
                        <List
                            style={{marginTop: 120}}
                            grid={{column: 1}}
                            itemLayout="horizontal"
                            dataSource={arrangeListMessage(messages as [])}
                            renderItem={(item, index) => (
                            <List.Item style={{float: item?.user.username !== dataUser?.username ? "right" : "left", borderStyle: "none"}}>
                            <div style={{backgroundColor: item?.user.username !== dataUser?.username ? "#C0DBEA": token.colorBgContainer, borderRadius: 10, padding: "12px 24px"}}>
                                <Typography>{item?.message}</Typography>
                            </div>
                            <p style={{fontSize: "12px", float:"left", margin: "5px 10px"}}>{validateTime(item?.time).split("(")[0]}</p>
                            </List.Item>
                            )}
                        />
                    </InfiniteScroll>
                </div>
                <Space.Compact 
                    style={{
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        width: '100%', 
                        height: "10%",
                        backgroundColor: "#fff",
                        bottom: 0,
                    }}>
                    <Form.Item style={{width: "100%",margin: 0}} name="message"> 
                        <Input onChange={() => setIsChanged(true)} size="large" bordered={false} maxLength={100} style={{ resize: 'none' }} allowClear suffix={suffix}/>
                    </Form.Item>
                </Space.Compact>
            </>
        }
        </Form>
        </>
    );
}
 
export default BoxChat;