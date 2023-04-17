import { CaretDownOutlined, LogoutOutlined, MessageOutlined, SettingOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Col, Dropdown, Menu, MenuProps, Modal, Row, Typography } from "antd";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { useAppSelector } from "src/shared/hooks/useRedux";
import { authService } from "~/shared/servers/auth.service";
import { logout, setCurrentBoxChat, setCurrentConversationIdChat, setCurrentUserIdChat } from "~/shared/store/appSlice";

const SiderHeader = ({}) => {
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_DEFAULT}`,{ transports : ['websocket']});
    const dataUser = useAppSelector((state) => state.appSlice.dataUser)
    const router = useRouter()
    const dispatch = useDispatch()
    const [isOpenModalLogout, setOpenModalLogout] = useState(false)
    const logoutMutation = useMutation({
        mutationKey: 'logout',
        mutationFn: (body: {email: string}) => authService.logout(body),
        onSuccess(data, variables, context) {
            deleteCookie("isAuthenticated")
            deleteCookie("dataUser")
            deleteCookie("currentUserIdChat")
            deleteCookie("currentConversationIdChat")
            deleteCookie("currentBoxChat")
            setTimeout(() => {
                dispatch(logout())
                dispatch(setCurrentBoxChat(-1))
                dispatch(setCurrentConversationIdChat(0))
                dispatch(setCurrentUserIdChat(0))
                router.push("/auth/login")
            }, 500)
        },
        onError(error, variables, context) {
            console.log(error)
        },
    })
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div>
                    Logout
                </div>
            ),
            icon: <LogoutOutlined />,
            onClick: () => setOpenModalLogout(true)
        },
    ]
    function handleLogout() {
        logoutMutation.mutate({email: dataUser?.email as string})
        socket.emit('logout', dataUser?.email)
    }

    return (
    <>  
    <Row gutter={32} justify="start" align="middle" style={{marginLeft: 12}}>
        <Col span={3}>
            <Typography>Chat RealTime</Typography>
        </Col>
        <Col span={17}> 
            <Menu
            mode="horizontal"
            defaultSelectedKeys={["/"]}
            items={[
            {
              key: '/',
              icon: <MessageOutlined />,
              label: 'Conversation',
            },
            {
              key: '/contacts',
              icon: <UsergroupAddOutlined />,
              label: 'Contacts',
            },
            {
              key: '/setting',
              icon: <SettingOutlined />,
              label: 'Setting',
            },
          ]}
          onClick={(menu) => {
            router.push(menu.key)
          }}
        />
        </Col>
        <Col span={4} style={{ cursor: "pointer"}}>
                <div className="h-full text-2xl flex items-center justify-start">
                    <img className="block m-2 max-w-[32px] max-h-[32px] rounded-[50px]" alt="userIcon" src={`${dataUser?.image}`} />
                    <Typography>{dataUser?.username}</Typography>
                    <Dropdown placement={"bottomRight"} trigger={"click"} menu={{ items }}>
                        <CaretDownOutlined/>
                    </Dropdown>

                </div>
        </Col>
    </Row>
    <Modal open={isOpenModalLogout} title="Bạn sắp đăng xuất?"
                onOk={handleLogout} onCancel={() => setOpenModalLogout(false)}
                okText="Đồng ý" cancelText="Hủy"
    ></Modal>
    </> 

    );
}
 
export default SiderHeader;