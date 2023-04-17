import Head from "next/head";
import { useQuery } from "react-query";
import { userService } from "~/shared/servers/user.service";
import {Layout} from "antd";
import SiderChat from "~/shared/layouts/components/SiderChat";
import { Content } from "antd/lib/layout/layout";
import { useState } from "react";
import { useAppSelector } from "src/shared/hooks/useRedux";
import BoxChat from "~/shared/components/BoxChat";

interface Props{
}
const Home = ({}:Props) => {
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
        <meta name="description" content="Chat App vanthuan76" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout style={{ minHeight: '100vh' }}>
            {participantsId && 
            <SiderChat participantsId={participantsId}/>
            }
            {currentUserIdChat &&
            <Layout style={{ padding: '0 12px 12px' }}>
                <Content style={{ margin: '24px 0 0' }}>
                    <div style={{ padding: 24, minHeight: 360, backgroundColor: "#fff", borderRadius: 10 }}>
                        <BoxChat currentUserIdChat={currentUserIdChat}></BoxChat>
                    </div>
                </Content>
            </Layout>
            }
        </Layout>
    </>
  );
};

export default Home;
