import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { type ChatRoom } from '../../types/ChatRoom'
import ChattingRoom from '../../components/ChattingRoom'

function ChatRoomSet (): React.JSX.Element {
  const [cookies] = useCookies(['chatUser', 'chatRoomMember', 'userData'])
  const [chatRoom, setChatRoom] = useState<ChatRoom[]>([])
  const [userUuid, setUserUuid] = useState('')
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
  const eventHandler = (): void | null => {
    console.log(chatRoom[0].members.userUuid)
    if (userUuid.length !== 36) {
      return null
    }
    chatRoom.forEach((e) => {
      if (e.members.userUuid === userUuid) {
        alert('이미 등록된 uuid입니다.')
        return null
      }
    })
    fetch('http://localhost:8080/api/follow', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uuid: cookies.userData.uuid, userUuid })
    }).then(async (res) => {
      console.log(cookies.chatUser.userUuid)
    }).catch((e) => {
      console.log('추가 실패', e)
    })
  }
  return (
        <div>
          <div>
            <input onChange={(e) => { setUserUuid(e.target.value) }}/>
            <button onClick={() => { eventHandler() }}>친구추가</button>
          </div>
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
