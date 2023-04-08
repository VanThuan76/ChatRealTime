import React, { ReactNode } from "react";
import { Layout} from "antd";
import SiderHeader from "./components/SiderHeader";

const { Header } = Layout;

interface Props {
    children: ReactNode
}
const DashboardLayout = ({children}:Props) => {
    return (
    <Layout>
        <Header style={{padding: 0, margin: 0, backgroundColor: "#fff"}}>
            <SiderHeader/>
        </Header>
        {children}
    </Layout>
    );
}
 
export default DashboardLayout;