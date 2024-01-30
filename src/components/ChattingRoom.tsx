import React from 'react'
import { type ChatRoom } from '../types/ChatRoom'
import { useCookies } from 'react-cookie'

const ChattingRoom: React.FC<ChatRoom> = ({ roomUuid, createdAt, members, lastMessage }): React.JSX.Element => {
  const [cookies, setCookie] = useCookies(['chatUser', 'chatRoomMember', 'userData'])
  const onClickHandler = (): void => {
    setCookie('chatRoomMember', members)
    setCookie('chatUser', { roomUuid, userUuid: members.userUuid, name: members.name })
    console.log('click!', cookies.chatRoomMember)
  }
  return (
    <div onClick={onClickHandler}>
      <div>
        <h3>{members.name}</h3>
        <p>{lastMessage}</p>
      </div>
      <div>
        <p>{createdAt}</p>
      </div>
    </div>
  )
}

export default ChattingRoom
