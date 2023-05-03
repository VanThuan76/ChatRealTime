import { Avatar, Badge, Card, Collapse, Input, Layout, List, Typography } from "antd";
import React, { ReactNode, useState } from "react";
import { useQueries, useQuery } from "react-query";
import { userService } from "~/shared/servers/user.service";
import { IUser } from "~/shared/typeDef/auth.type";
import { useDispatch } from "react-redux";
import { setCurrentBoxChat, setCurrentConversationIdChat, setCurrentUserIdChat } from "~/shared/store/appSlice";
import { setCookie } from "cookies-next";
import { useAppSelector } from "~/shared/hooks/useRedux";
import { io } from "socket.io-client";
import { MoreOutlined } from "@ant-design/icons";
const { Sider } = Layout;
const { Panel } = Collapse;
const { Search } = Input;

interface Props {
    participantsId: any
}
const SiderChat = ({participantsId}: Props) => {
    const dispatch = useDispatch()
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_DEFAULT}`,{ transports : ['websocket']});
    const [usernameCurrent, setUsernameCurrent] = useState<string>()
    const [collapsed, setCollapsed] = useState(true);
    const {currentBoxChat, dataUser} = useAppSelector((state) => state.appSlice)
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
    const handleSearch = (value: string) => {
        console.log('search value:', value);
    };
    return (
        <Sider
        style={{ background: "#fff" , margin: '24px 2px 0', borderRadius: 10 }} width={300}
        >
        <Card size="small" bordered>
            <div className="text-2xl flex items-center justify-start">
                <img className="block m-2 max-w-[32px] max-h-[32px] rounded-[50px]" alt="userIcon" src={`${dataUser?.image}`} />
                <Typography>{dataUser?.username}</Typography>
                <MoreOutlined style={{fontSize: "18px", position: "absolute", right: 10}} />
            </div>
        </Card>
        <Search 
        size="large"
        style={{margin: "10px 0", padding: "0 10px"}}
        placeholder="Search or start new chat..." 
        onSearch={handleSearch} 
        enterButton />

        {
           collapsed && queryResults && listUserChat &&
           <Collapse defaultActiveKey={1} style={{border: "none"}} size="small" bordered={false}>
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