import { AudioOutlined, FileImageOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Form, List, Row, Skeleton, Space, Input, Button, Select, Typography, theme, Tooltip } from "antd";
import { useEffect, useState } from "react";
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
const {Option} = Select

interface Props{
    currentUserIdChat: number
}
const BoxChat = ({currentUserIdChat}: Props) => {
const [form] = Form.useForm();
const [emoji, setEmoji] = useState(null);
const [trigger, setTrigger] = useState(false);
const [socket, setSocket] = useState(io(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_DEFAULT}`,{ transports : ['websocket']}));
const [messages, setMessages] = useState<string[]>([]);
const [typeInput, setTypeInput] = useState<string>()
const [isChanged, setIsChanged] = useState<boolean>(false)
const {dataUser, currentConversationIdChat} = useAppSelector((state) => state.appSlice)
const { token } = theme.useToken();
const dispatch = useDispatch()
const handleSelectEmoji = (e:any) => {
    setEmoji(e.native);
    setTrigger(!trigger)
};
const suffix = (
    <Row gutter={16}>
       <Col>
            <Tooltip open={trigger} color={"transparent"} title={ <Picker previewPosition={top} data={data} onEmojiSelect={(e:any) => handleSelectEmoji(e)} /> }>
                <SmileOutlined onClick={() => setTrigger(!trigger)} style={{fontSize: 16, color: '#1890ff'}}/>
            </Tooltip>
       </Col>
       <Col> 
            <FileImageOutlined style={{fontSize: 16, color: '#1890ff'}}/>
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
};
const selectBefore = (
    <Select onChange={(value:string) => setTypeInput(value)} style={{height: "100%"}} defaultValue="SMS">
      <Option value="SMS">SMS</Option>
      <Option value="Voice">Voice</Option>
    </Select>
);
    return (  
        <>
        <Form style={{minHeight: "600px", backgroundColor: token.colorBgContainer, position: "relative", borderRadius: 10}}
            form={form}
            onFinish={handleMessage}
            autoComplete="off"
            name="basic"
            scrollToFirstError={true}
        >
        <Card title="Message" extra={<Typography>...</Typography>} style={{position: "absolute", top: 0, left:0, width: "100%", opacity: 0.7, backdropFilter: "blur(10px)", zIndex: "10", backgroundBlendMode: "lighten"}}></Card>
        {
             messages && messageGet && messageSend &&
             <>
                <div id="scrollableDiv" style={{height: 450, overflow: 'auto', padding: '0 16px'}}>
                    <InfiniteScroll
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
                            <List.Item style={{float: item?.user.username !== dataUser?.username ? "right" : "left", borderStyle: "none", width: "400px"}}>
                                <List.Item.Meta
                                avatar={<Avatar src={item?.user.image} />}
                                title={item?.user.username}
                                description={validateTime(item?.time)}
                            />
                            <div style={{backgroundColor: token.colorBgContainer, borderRadius: 5, padding: "6px 12px"}}>
                                <Typography>{item?.message}</Typography>
                            </div>
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
                        width: '80%', 
                        backgroundColor: "#fff",
                        borderRadius: 10, 
                        bottom: 10,
                        left: 70,
                    }}>
                    <Form.Item style={{width: "100%",margin: 0}} name="message"> 
                        <Input onChange={() => setIsChanged(true)} disabled={typeInput === "Voice"} size="large" bordered={false} maxLength={100} style={{ resize: 'none' }} addonBefore={selectBefore} allowClear suffix={suffix}/>
                    </Form.Item>
                    <Button htmlType="submit" style={{borderStyle: "none", textAlign: "center"}}>
                        {typeInput === "Voice" ?
                            <AudioOutlined style={{ fontSize: 16, color: '#1890ff'}}/> :
                            <SendOutlined style={{ fontSize: 16, color: '#1890ff'}}/>
                        }
                    </Button>
                </Space.Compact>
            </>
        }
        </Form>
        </>
    );
}
 
export default BoxChat;