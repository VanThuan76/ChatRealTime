import Head from "next/head";
import { useQuery } from "react-query";
import { userService } from "~/shared/servers/user.service";
import {Layout, theme} from "antd";
import SiderChat from "~/shared/layouts/components/SiderChat";
import { Content, Footer } from "antd/lib/layout/layout";
import { useState } from "react";
import { useAppSelector } from "src/shared/hooks/useRedux";
import BoxChat from "~/shared/components/BoxChat";
import SiderMenu from "~/shared/layouts/components/SiderMenu";

interface Props{
}
const Home = ({}:Props) => {
  const { token } = theme.useToken();
  const [participantsId, setParticipantsId] = useState()
  const {currentUserIdChat} = useAppSelector((state) => state.appSlice)
  const dataUser = useAppSelector((state) => state.appSlice.dataUser)
  useQuery(["inforUser", participantsId], () => userService.infoUser({username: dataUser?.username as string}), {
    select(data) {
      const response = data.data[0]
      const conversations = response.conversations      
      return conversations
    },
    onSuccess(data) {
      const participantsId = data.map((item:any) => {
        const data = item.conversation.participants.find((itemChild:any) => {
          return itemChild.userId !== dataUser?.id
        })
        return data.userId
      })
      setParticipantsId(participantsId)
    },
    enabled: !!dataUser
  })
  return (
    <>
      <Head>
        <title>Chat App</title>
      </Head>
            {participantsId && 
            <SiderChat participantsId={participantsId}/>
            }
            {currentUserIdChat &&
            <Layout style={{ padding: '0 12px 12px' }}>
                <Content style={{ margin: '24px 0 0', display: "flex", flexDirection: "column", justifyContent: "space-between"  }}>
                    <div style={{ padding: 24, backgroundColor: token.colorBgBase, borderRadius: 10 }}>
                        <BoxChat currentUserIdChat={currentUserIdChat}></BoxChat>
                    </div>
                <Footer style={{borderRadius: 10, marginTop: 10}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <p>Bản quyền ©2023 tạo bởi ThuanVuVan</p>
                      <a href="/">Home</a>
                    </div>
                </Footer>
                </Content>
            </Layout>
            }
    </>
  );
};

export default Home;
