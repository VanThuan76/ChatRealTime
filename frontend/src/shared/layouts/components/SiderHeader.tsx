import { LogoutOutlined, MessageOutlined, SettingOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Col, Dropdown, Menu, MenuProps, Modal, Row, Typography } from "antd";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useState } from "react";

const SiderHeader = ({}) => {
    const router = useRouter()
    const [isOpenModalLogout, setOpenModalLogout] = useState(false)
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
        deleteCookie("isAuthenticated")
        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            router.push("/login")
        }, 500)
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
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            router.push(menu.key)
          }}
        />
        </Col>
        <Col span={3} style={{ cursor: "pointer"}}>
            <Dropdown menu={{ items }}>
                <div className="h-full text-2xl flex items-center justify-start">
                    <img className="block m-2 max-w-[32px] max-h-[32px] rounded-[50px]" alt="userIcon" src="https://joesch.moe/api/v1/random?key=1" />
                    <Typography>UserName</Typography>
                </div>
            </Dropdown>
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