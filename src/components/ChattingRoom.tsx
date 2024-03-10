import React, { useEffect, useState } from 'react'
import { type ChatRoom } from '../types/ChatRoom'
import { useCookies } from 'react-cookie'
import './ChattingRoom.css'

const ChattingRoom: React.FC<ChatRoom> = ({ roomUuid, updateAt, members, lastMessage }): React.JSX.Element => {
  const [, setCookie] = useCookies(['chatUser', 'chatRoomMember', 'userData'])
  const [status, setStatus] = useState(1)
  useEffect(() => {
    fetch('http://localhost:8080/api/countStatus', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ roomUuid })
    }).then(async (res) => {
      const date = await res.json()
      setStatus(date[0].countStatus)
    }).catch((e) => {
      alert(e)
    })
  })
  const onClickHandler = (): void => {
    setCookie('chatRoomMember', members)
    setCookie('chatUser', { roomUuid, userUuid: members.userUuid, name: members.name })
    console.log('chatUser', { roomUuid, userUuid: members.userUuid, name: members.name })
  }
  return (
    <div className={'chattingRoom'} onClick={onClickHandler}>
      <div className={'room_L'}>
        <p className={'room_UserName'}>{members.name}</p>
        <p className={'room_content'}>{lastMessage}</p>
      </div>
      <div className={'room_R'}>
        <p className={'room_updateTime'}>{updateAt}</p>
        {status === 0
          ? null
          : (<div className={'room_divStatus'}>
            <p className={'room_status'}>{status}</p>
          </div>)
        }
      </div>
    </div>
  )
}

export default ChattingRoom
