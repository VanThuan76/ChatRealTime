import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Avatar, Badge, Col, Collapse, Input, Layout, List, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useQueries, useQuery } from "react-query";
import { userService } from "~/shared/servers/user.service";
import { IUser } from "~/shared/typeDef/auth.type";
import { useDispatch } from "react-redux";
import { setCurrentBoxChat, setCurrentConversationIdChat, setCurrentUserIdChat } from "~/shared/store/appSlice";
import { setCookie } from "cookies-next";
import { useAppSelector } from "~/shared/hooks/useRedux";
import { io } from "socket.io-client";
const { Sider } = Layout;
const { Panel } = Collapse;

interface Props {
    participantsId: any
}
const SiderChat = ({participantsId}: Props) => {
    const dispatch = useDispatch()
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_DEFAULT}`,{ transports : ['websocket']});
    const [usernameCurrent, setUsernameCurrent] = useState<string>()
    const [collapsed, setCollapsed] = useState(true);
    const {currentBoxChat} = useAppSelector((state) => state.appSlice)
    const listUserChat: IUser[] = []
    const queryResults = useQueries(
        participantsId.map((userId:any) => ({
          queryKey: ['listUserChat', { userId },participantsId], 
          queryFn: () => userService.getUser({ userId }), 
          select: (data:any) => {
            listUserChat.push(data.data[0])
            // socket.emit("updateListUserChat", listUserChat)
            return data.data[0]
          },
        }))
    );
    console.log(queryResults)
    // useEffect(() => {
    //     socket.on('listUserChat', listUserChat => {
    //             return listUserChat
    //     })
    // }, [])
    useQuery(["inforUserCurrent", usernameCurrent], () => userService.infoUser({username: usernameCurrent!}), {
        select(data) {
        return data.data
        },
        onSuccess(data) {  
            const response = data.map((item:any) => {
                const response = item.conversations.map((itemChild:any) => {
                    return itemChild.conversationId
                })
                return response
            })
            const currentConversationIdChat = dispatch(setCurrentConversationIdChat(response))
            setCookie("currentConversationIdChat", currentConversationIdChat )
        },
        enabled: !!usernameCurrent
    }) 
    const handleChoose = ({userId,userNameCurrent,index}: {userId: number,userNameCurrent: string, index:number}) => {
        setUsernameCurrent(userNameCurrent)
        dispatch(setCurrentConversationIdChat(0))
        const currentUserIdChat = dispatch(setCurrentUserIdChat(userId))
        setCookie("currentUserIdChat", currentUserIdChat )
        const currentBoxChat = dispatch(setCurrentBoxChat(index))
        setCookie("currentBoxChat", currentBoxChat)
    }
    const handleSearch = (value: string | number) => {
        console.log('search value:', value);
    };
    return (
        <Sider
        style={{ background: "#fff" , margin: '24px 2px 0', borderRadius: 10 }} width={300}
        >
         <Input.Search
            style={{ display: "flex", margin: "12px", width: "90%" }}
            placeholder={"Search"}
            allowClear
            // enterButton={<SearchOutlined/>}
            size="middle"
            onSearch={(value) => handleSearch(value)}
        />
        {
           collapsed && queryResults && listUserChat &&
           <Collapse  style={{border: "none"}} size="small" bordered={false}>
            <Panel header={`All Message ${queryResults?.length}`} key="1">
            <List
            itemLayout="horizontal"
            dataSource={listUserChat}
            renderItem={(item:IUser, index) => (
            <List.Item style={{margin: "0 12px"}} onClick={() => handleChoose({userId: item.id as number, userNameCurrent: item.username as string ,index})}>
                <List.Item.Meta
                    style={{backgroundColor: currentBoxChat === index ? "#EEEEEE" : "", padding: "12px", borderRadius: 10, cursor: "pointer"}}
                    avatar={
                    <Badge color={item?.active === 1 ? "green" : "red"} dot={true}>
                        <Avatar src={`${item.image}`} />
                    </Badge>
                    }
                    title={item.username}
                    description={item.name}
                />
            </List.Item>
            )}
            />
            </Panel>
            </Collapse>   
        }
      </Sider>
      );
}
 
export default SiderChat;