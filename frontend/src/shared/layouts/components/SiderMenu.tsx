import { DeleteOutlined, LeftOutlined, MessageOutlined, MinusCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useState } from "react";
const { Sider } = Layout;

const SiderMenu = ({}) => {
    const [collapsed, setCollapsed] = useState(false);
    return (  
        <Sider
        style={{background: "#fff", margin: '24px 12px 0', borderRadius: 10 }} width={200}
        trigger={null} collapsible collapsed={collapsed}
        >
        <div className="flex mr-2">
            <div className="flex-initial w-64"></div>
            <div className="text-1xl">
            {React.createElement(collapsed ? LeftOutlined : RightOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
            })}
            </div>
        </div>
        
        <Menu
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={[
            {
              key: '1',
              icon: <MessageOutlined />,
              label: 'All',
            },
            {
              key: '2',
              icon: <MinusCircleOutlined />,
              label: 'Block',
            },
            {
              key: '3',
              icon: <DeleteOutlined />,
              label: 'Trash',
            },
          ]}
        />
      </Sider>
    );
}
 
export default SiderMenu;