import React, { type KeyboardEventHandler, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import TextField from '@mui/material/TextField'
import './DataInputArea.css'
import './MessagePrint.css'
import Box from '@mui/material/Box'
import TimeStampAdapter from '../../components/TimeStampAdapter'
import { io } from 'socket.io-client'
import UiMessage from '../../components/UiMessage'
import type MessageUi from '../../types/MessageUi'
import { v4 } from 'uuid'

function Chatting (): React.JSX.Element {
  const [text, setText] = useState('')
  const [cookies, setCookie] = useCookies(['userText', 'chatUser', 'chatRoomMember', 'userData'])
  const [message, setMessage] = useState<MessageUi[]>([])
  const socket = io('http://localhost:8080/')
  useEffect(() => {
    if (cookies.userText !== undefined) {
      return () => {
        setCookie('userText', text)
      }
    }
    selectChat()
    onSocket()
    console.log(message)
  }, [cookies.chatUser])
  window.addEventListener('focus', (): void | null => {
    if (cookies.chatUser.userUuid === undefined) {
      return null
    }
    fetch('http://localhost:8080/api/readMessage', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ roomUuid: cookies.chatUser.roomUuid })
    }).then(async () => { selectChat() })
      .catch((e) => { alert(e) })
  })
  const selectChat = (): void => {
    console.log('cookies.chatUser.roomUuid = ', cookies.chatUser.roomUuid)
    fetch('http://localhost:8080/api/selectChat', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ roomUuid: cookies.chatUser.roomUuid })
    }).then(async (res) => {
      const data = await res.json()
      console.log('selectChat respons', data)
      setMessage(data)
    }).catch((e) => {
      console.log(e)
    })
  }
  const onSocket = (): void | null => {
    if (cookies.chatUser.userUuid === undefined) {
      console.log('null 반환됨')
      return null
    }
    // const chattingRoom: ChatUser = {
    //   uuid: cookies.userData.uuid,
    //   userUuid: cookies.chatUser.userUuid
    // }
    socket.on('msgBroadcast', (data) => {
      if (cookies.userData.uuid === data.receiveUuid) {
        const receiveData = {
          id: data.id,
          content: data.content,
          isFromSender: cookies.chatUser.userUuid,
          readStatus: data.readStatus,
          time: data.time
        }
        setMessage((e) => [...e, receiveData])
      }
    })
    socket.on('disconnect', function () {
      console.log('disconnected..')
    })
  }
  const chatUser = (): React.JSX.Element => {
    return (
      <div className={'messagePrint_Header'}>
        <p>{cookies.chatUser.name}</p>
      </div>
    )
  }
  const textInputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setText(e.target.value)
  }
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement | HTMLDivElement> = (e) => {
    if (e.key === 'Enter') {
      if (text === '' || text === '\n') {
        setText('')
        return null
      }
      const sendFormat = {
        roomUuid: cookies.chatUser.roomUuid,
        uuid: cookies.userData.uuid,
        createdAt: TimeStampAdapter(Date.now()),
        userUuid: cookies.chatUser.userUuid,
        message: text
      }
      socket.emit('msgSend', sendFormat)
      setText('')
      const myChat = {
        id: v4(),
        content: text,
        isFromSender: `${cookies.userData.uuid}`,
        readStatus: 0,
        time: `${TimeStampAdapter(Date.now())}`
      }
      setMessage((e) => [...e, myChat])
      fetch('http://localhost:8080/api/send', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(sendFormat)
      }).then(() => {
        console.log('전송 성공')
      }).catch(() => {
        console.log('전송 실패')
      })
    }
  }
  return (
    <div>
      <div className={'messagePrint'}>
        {chatUser()}
        <>
          <div style={{ height: '52vh', backgroundColor: 'green' }}>
            {message.map((data, index): React.JSX.Element => {
              return <UiMessage id={data.id}
                                content={data.content}
                                isFromSender={data.isFromSender}
                                readStatus={data.readStatus}
                                time={data.time}
                                key={index}/>
            })}
          </div>
        </>
      </div>
      <div className={'dataInputArea'}>
        <Box component="form"
             sx={{
               '& .MuiTextField-root': { m: 1, width: '25ch' }
             }}
             noValidate
             autoComplete="off">
          <div>
            <TextField
              className={'textField'}
              id="outlined-multiline-static"
              label="Multiline"
              multiline
              rows={4}
              onChange={(e) => { textInputHandler(e) }}
              value={ text }
              onKeyDown={(e) => { handleKeyDown(e) }}
            />
          </div>
        </Box>
      </div>
    </div>
  )
}

export default Chatting
