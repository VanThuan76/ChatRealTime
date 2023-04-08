import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Avatar, Col, Input, Layout, List, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { IUser } from "~/shared/typeDef/auth.type";
const { Sider } = Layout;
interface Props {
    data: IUser[] | undefined
    setRoomId: any
}
const SiderChat = ({data, setRoomId}: Props) => {
    const [initLoading, setInitLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(true);
    const handleSearch = (value: string | number) => {
        console.log('search value:', value);
        // Perform search operation here
    };
    useEffect(() => {
        setTimeout(() => {
            setInitLoading(!initLoading)
        },2000)
    }, [])
    const handleChoose = (id:number) => {
        setRoomId(id)
    }
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
        <Row gutter={[16, 24]}>
            <Col>
                {React.createElement(collapsed ? DownOutlined : RightOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
                })}
            </Col>
            <Col>
                <Typography>All Message</Typography>
            </Col>
            <Col>
                <p style={{color: "#555"}}>4</p>
            </Col>
        </Row>
        {
           collapsed && data &&
           <List
            itemLayout="horizontal"
            dataSource={data}
            loading={initLoading}
            renderItem={(item, index) => (
            <List.Item style={{margin: "0 12px"}} onClick={() => handleChoose(item.id)}>
                <List.Item.Meta
                    avatar={<Avatar src={`https://joesch.moe/api/v1/random?key=${index}`} />}
                    title={item.username}
                    description="Ant Design"
                />
            </List.Item>
            )}
        />
        }
        
      </Sider>
      );
}
 
export default SiderChat;