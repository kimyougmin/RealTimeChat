import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Button, Input } from '@mui/material'
import './MessagePrint.css'
import { type ChatRoomMember } from '../../types/ChatRoomMember'
import { io } from 'socket.io-client'
import UiMessage from '../../components/UiMessage'
import type MessageUi from '../../types/MessageUi'

function MessagePrintArea (): React.JSX.Element {
  const [cookies, setCookie] = useCookies(['chatUser', 'chatRoomMember', 'userData'])
  const [userUuid, setUserUuid] = useState('')
  const [message, setMessage] = useState<MessageUi[]>([])
  useEffect(() => {
    onSocket()
  }, [])
  window.addEventListener('focus', (): void => {
    const tempMessage = message.map((data, index) => {
      return {
        id: data.id,
        content: data.content,
        is_from_sender: data.is_from_sender,
        read_status: 0,
        time: data.time
      }
    })
    setMessage(tempMessage)
  })
  // const onSelectChat = (): void => {
  //   fetch('http://localhost:8080/api/selectChat', {
  //     method: 'post',
  //     headers: { 'content-type': 'application/json' },
  //     body: JSON.stringify(cookies.chatRoomMember)
  //   }).then(async (res) => {
  //     const date = await res.json()
  //     setMessage(date)
  //     localStorage.setItem(cookies.chatRoomMember.userUuid, JSON.stringify(date))
  //     console.log('조회 원료')
  //   }).catch(() => {
  //     console.log('조회 실패')
  //   })
  // }
  const onSocket = (): void => {
    const socket = io('http://localhost:8080/')

    socket.on('connect', function () {
      console.log('connected!')
      socket.emit('test', cookies.chatRoomMember)
    })
    socket.on('selectData', async (date) => {
      const dataJson = await date
      console.log(dataJson)
      setMessage(dataJson)
      socket.emit('test', cookies.chatRoomMember)
    })
    socket.on('disconnect', function () {
      console.log('disconnected..')
    })
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
        ...cookies.chatRoomMember,
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
    if (cookies.chatUser !== undefined) {
      return (
        <div className={'messagePrint_Header'}>
          <p>{cookies.chatUser.name}</p>
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
  // const messageRender = (): React.JSX.Element => {
  //   message.map((data, index): React.JSX.Element => {
  //     return <UiMessage id={data.id}
  //                       content={data.content}
  //                       is_from_sender={data.is_from_sender}
  //                       read_status={data.read_status}
  //                       time={data.time}
  //                       key={index}/>
  //   })
  // }
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
