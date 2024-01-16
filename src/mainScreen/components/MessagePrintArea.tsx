import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Button, Input } from '@mui/material'
import './MessagePrint.css'
import { type ChatRoomMember } from '../../types/ChatRoomMember'
import { io } from 'socket.io-client'
import UiMessage from '../../components/UiMessage'
import type MessageUi from '../../types/MessageUi'
import type ChatUser from '../../types/ChatUser'

function MessagePrintArea (): React.JSX.Element {
  const [cookies, setCookie] = useCookies(['chatUser', 'chatRoomMember', 'userData'])
  const [userUuid, setUserUuid] = useState('')
  const [message, setMessage] = useState<MessageUi[]>([])
  useEffect(() => {
    onSocket()
  }, [cookies.chatUser.userUuid])
  window.addEventListener('focus', (): void | null => {
    if (cookies.chatUser.userUuid === undefined) {
      return null
    }
    console.log('포커스 이벤트 실행')
    const chattingRoom: ChatUser = {
      uuid: cookies.userData.uuid,
      userUuid: cookies.chatUser.userUuid
    }
    fetch('http://localhost:8080/api/readMessage', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(chattingRoom)
    }).then(async () => { console.log('읽음') })
      .catch((e) => { alert(e) })
  })
  const onSocket = (): void | null => {
    if (cookies.chatUser.userUuid === undefined) {
      console.log('null 반환됨')
      return null
    }
    const chattingRoom: ChatUser = {
      uuid: cookies.userData.uuid,
      userUuid: cookies.chatUser.userUuid
    }
    const socket = io('http://localhost:8080/')

    socket.on('disconnect', function () {
      console.log('disconnected..')
    })
    setInterval(() => {
      socket.emit('test', chattingRoom)
      socket.on('selectData', async (date) => {
        const dataJson = await date
        console.log('dataJson', dataJson)
        setMessage(dataJson)
      })
    }, 5000)
  }
  const setChat = (): void => {
    // if (cookies.chatRoomMember.userUuid === userUuid) {
    //   alert('이미 존재하는 아이디입니다.')
    //   return null
    // }
    fetch('http://localhost:8080/api/follow', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uuid: userUuid })
    }).then(async (res) => {
      const data = await res.json()
      const temp: ChatRoomMember = {
        uuid: cookies.userData.uuid,
        name: data[0].name,
        userUuid: data[0].id
      }
      setCookie('chatRoomMember', temp)
      setCookie('chatUser', { userUuid: data[0].id, name: data[0].name })
      console.log(cookies.chatUser.userUuid)
    }).catch((e) => {
      console.log('추가 실패', e)
    })
  }
  const chatUser = (): React.JSX.Element => {
    if (userUuid === '') {
      return (
        <div className={'messagePrint_Header'}>
          <p>{cookies.chatUser.name}</p>
          <Button onClick={() => { setCookie('chatUser', undefined) }} >다른 대화 상대</Button>
        </div>
      )
    }
    return (
      <div className={'messagePrint_Header'}>
        <Input value={userUuid} onChange={(e) => { setUserUuid(e.target.value) }}/>
        <Button onClick={setChat}>유저 추가</Button>
      </div>
    )
  }
  return (
        <div className={'messagePrint'}>
          {chatUser()}
          <div style={{ height: '300vh' }}>
            {message.map((data, index): React.JSX.Element => {
              return <UiMessage id={data.id}
                                content={data.content}
                                is_from_sender={data.is_from_sender}
                                read_status={data.read_status}
                                time={data.time}
                                key={index}/>
            })}
          </div>
        </div>
  )
}

export default MessagePrintArea
