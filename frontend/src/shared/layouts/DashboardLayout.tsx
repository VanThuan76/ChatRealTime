import React, { ReactNode, useEffect } from "react";
import { Layout} from "antd";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login, setCurrentBoxChat, setCurrentConversationIdChat, setCurrentUserIdChat } from "../store/appSlice";
import { Footer } from "antd/lib/layout/layout";
import SiderMenu from "./components/SiderMenu";
import SiderChat from "./components/SiderChat";

const { Header } = Layout;

interface Props {
    children: ReactNode
}
const DashboardLayout = ({children}:Props) => {
    const router = useRouter()
    const dispatch = useDispatch()
    useEffect(() => {
        const auth = getCookie('isAuthenticated')
        const dataUser = getCookie('dataUser')
        const currentUserIdChat = getCookie("currentUserIdChat")
        const currentConversationIdChat = getCookie("currentConversationIdChat")
        const currentBoxChat = getCookie("currentBoxChat")
         if(auth && dataUser && currentUserIdChat && currentConversationIdChat && currentBoxChat){
            dispatch(login(JSON.parse(dataUser as string)))
            dispatch(setCurrentUserIdChat(JSON.parse(currentUserIdChat as string).payload))
            dispatch(setCurrentConversationIdChat(JSON.parse(currentConversationIdChat as string).payload))
            dispatch(setCurrentBoxChat(JSON.parse(currentBoxChat as string).payload))
            router.push("/")
        }
    },[])
    return (
    <Layout style={{ minHeight: '100vh' }}>
        {/* <Layout style={{ minHeight: '100vh' }}> */}
        <SiderMenu/>
        {children}
        {/* </Layout> */}
    </Layout>
    );
}
 
export default DashboardLayout;