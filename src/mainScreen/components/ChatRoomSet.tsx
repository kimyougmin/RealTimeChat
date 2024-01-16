import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { type ChatRoom } from '../../types/ChatRoom'
import ChattingRoom from '../../components/ChattingRoom'

function ChatRoomSet (): React.JSX.Element {
  const [cookies] = useCookies(['chatUser', 'chatRoomMember', 'userData'])
  const [chatRoom, setChatRoom] = useState<ChatRoom[]>([])
  useEffect(() => {
    let tempChatRoom: ChatRoom[] = []
    let tempUuid: string = ''
    fetch('http://localhost:8080/api/charRoom', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(cookies.userData)
    }).then(async (res) => {
      const data = await res.json()
      console.log('data', data)
      data.forEach((e) => {
        if (e.from_id !== cookies.userData.uuid) {
          tempUuid = e.from_id
        } else {
          tempUuid = e.to_id
        }
        tempChatRoom = [...tempChatRoom, {
          roomUuid: e.id,
          createdAt: e.time,
          members: {
            uuid: cookies.userData.uuid,
            name: e.name,
            userUuid: tempUuid
          },
          lastMessage: e.subject
        }]
      })

      setChatRoom(tempChatRoom)

      console.log('tempChatRoom', tempChatRoom)
    }).catch((e) => {
      alert(e)
    })
  }, [])
  // const testChatRoomSearch = (): void => {
  //   let tempChatRoom: ChatRoom[] = []
  //   fetch('http://localhost:8080/api/charRoom', {
  //     method: 'post',
  //     headers: { 'content-type': 'application/json' },
  //     body: JSON.stringify(cookies.userData)
  //   }).then(async (res) => {
  //     const data = res.json()
  //     data.forEach((e) => {
  //       tempChatRoom = [...tempChatRoom, {
  //         roomUuid: e.id,
  //         createdAt: e.time,
  //         members: {
  //           uuid: e.from_id,
  //           name: e.name,
  //           userUuid: e.to_id
  //         },
  //         lastMessage: e.subject
  //       }]
  //     })
  //
  //     setChatRoom(tempChatRoom)
  //   }).catch((e) => { alert(e) })
  // }
  return (
        <div>
           {chatRoom.map((e, index) => {
             return <ChattingRoom key={e.roomUuid}
                                 roomUuid={e.roomUuid}
                                 createdAt={e.createdAt}
                                 members={e.members}
                                 lastMessage={e.lastMessage}
            />
           })}
        </div>
  )
}

export default ChatRoomSet
