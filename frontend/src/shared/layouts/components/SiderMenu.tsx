import { DeleteOutlined, LeftCircleOutlined, MessageOutlined, MinusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { Dropdown, Layout, Menu, Modal} from "antd";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { useAppSelector } from "~/shared/hooks/useRedux";
import { authService } from "~/shared/servers/auth.service";
import { logout, setCurrentBoxChat, setCurrentConversationIdChat, setCurrentUserIdChat } from "~/shared/store/appSlice";
const { Sider } = Layout;

const SiderMenu = ({}) => {
    const router = useRouter()
    // const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_DEFAULT}`,{ transports : ['websocket']});
    // const dataUser = useAppSelector((state) => state.appSlice.dataUser)
    // const dispatch = useDispatch()
    // const [isOpenModalLogout, setOpenModalLogout] = useState(false)
    // const logoutMutation = useMutation({
    //     mutationKey: 'logout',
    //     mutationFn: (body: {email: string}) => authService.logout(body),
    //     onSuccess(data, variables, context) {
    //         deleteCookie("isAuthenticated")
    //         deleteCookie("dataUser")
    //         deleteCookie("currentUserIdChat")
    //         deleteCookie("currentConversationIdChat")
    //         deleteCookie("currentBoxChat")
    //         setTimeout(() => {
    //             dispatch(logout())
    //             dispatch(setCurrentBoxChat(-1))
    //             dispatch(setCurrentConversationIdChat(0))
    //             dispatch(setCurrentUserIdChat(0))
    //             router.push("/auth/login")
    //         }, 500)
    //     },
    //     onError(error, variables, context) {
    //         console.log(error)
    //     },
    // })
    // function handleLogout() {
    //   logoutMutation.mutate({email: dataUser?.email as string})
    //   socket.emit('logout', dataUser?.email)
    // }
    return (  
        <Sider
        style={{background: "#fff", margin: '24px 12px 0', borderRadius: 10 }} width={200}
        collapsed={true} 
        >  
        <Menu
          style={{borderRadius: 10}}
          defaultSelectedKeys={[router.pathname]}
          mode="inline"
          items={[
            {
              key: '/',
              icon: <MessageOutlined />,
              label: 'All',
            },
            {
              key: '/block',
              icon: <MinusCircleOutlined />,
              label: 'Block',
            },
            {
              key: '/trash',
              icon: <DeleteOutlined />,
              label: 'Trash',
            },
            {
              key: '/setting',
              icon: <SettingOutlined />,
              label: 'Setting',
            }
          ]}
          onClick={(menu) => {
            router.push(menu.key)
          }}
        />
        {/* <div style={{width: "100%",display: "flex", justifyContent: "space-between", position: "absolute", bottom: 10}}>
          <a href="/auth/login">
            <LeftCircleOutlined style={{fontSize: "24px"}}></LeftCircleOutlined>
          </a>
          <div></div>
        </div> */}
        {/* <Dropdown placement={"bottomRight"}>
        </Dropdown>
        <Modal open={isOpenModalLogout} title="Bạn sắp đăng xuất?"
                onOk={handleLogout} onCancel={() => setOpenModalLogout(false)}
                okText="Đồng ý" cancelText="Hủy"
        ></Modal> */}
      </Sider>
    );
}
 
export default SiderMenu;