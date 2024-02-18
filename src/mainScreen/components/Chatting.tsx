import React, { type KeyboardEventHandler, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import TextField from '@mui/material/TextField'
import './Chatting.css'
import Box from '@mui/material/Box'
import TimeStampAdapter from '../../components/TimeStampAdapter'
import { io } from 'socket.io-client'
import UiMessage from '../../components/UiMessage'
import type MessageUi from '../../types/MessageUi'
import { v4 } from 'uuid'
import TimeStampUiMessageProcessing from '../../components/TimeStampUiMessageProcessing'

function Chatting (): React.JSX.Element {
  const [text, setText] = useState('')
  const [cookies] = useCookies(['userText', 'chatUser', 'chatRoomMember', 'userData'])
  const [message, setMessage] = useState<MessageUi[]>([])
  const socket = io('http://localhost:8080/')
  useEffect(() => {
    selectMessage()
    onSocket()
  }, [cookies.chatUser.roomUuid])

  // window.addEventListener('focus', (): void | null => {
  //   console.log('window.addEventListener')
  //   if (cookies.chatUser.userUuid === undefined) {
  //     return null
  //   }
  //   fetch('http://localhost:8080/api/readMessage', {
  //     method: 'post',
  //     headers: { 'content-type': 'application/json' },
  //     body: JSON.stringify({ roomUuid: cookies.chatUser.roomUuid })
  //   }).then(() => { selectMessage() })
  //     .catch((e) => { alert(e) })
  // })

  const selectMessage = (): void => {
    fetch('http://localhost:8080/api/selectChat', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ roomUuid: cookies.chatUser.roomUuid })
    }).then(async (res) => {
      const data = await res.json()
      setMessage(data)
    }).catch((e) => {
      console.log(e)
    })
  }

  const onSocket = (): void | null => {
    if (cookies.chatUser.userUuid === undefined) {
      return null
    }
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
  let isReturn: boolean = true
  const validationCheck = (e): boolean => {
    if (e.shiftKey && e.key === 'Enter') {
      isReturn = false
      return true
    }
    if (text === '' && e.key === 'Enter') {
      isReturn = true
      return true
    }
    if (e.key === 'Enter') {
      isReturn = true
      return false
    }
    isReturn = false
    return true
  }
  const textInputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void | null => {
    if (isReturn) {
      return null
    }
    setText(e.target.value)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement | HTMLDivElement> = (e) => {
    if (validationCheck(e)) {
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

    // 자신이 보낸 채팅을 추가하는 부분
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
  return (
    <div>
      <div className={'messagePrint'}>
        <div className={'messagePrint_Header'}>
          <p style={{ color: 'white', fontSize: 15 }}>{cookies.chatUser.name}</p>
        </div>
        <div className={'messageBox'}>
          {message.map((data, index): React.JSX.Element => {
            return <UiMessage id={data.id}
                              content={data.content}
                              isFromSender={data.isFromSender}
                              readStatus={data.readStatus}
                              time={TimeStampUiMessageProcessing(data.time)}
                              key={index}/>
          })}
        </div>
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
              onChange={textInputHandler}
              value={ text }
              onKeyDown={handleKeyDown}
            />
          </div>
        </Box>
      </div>
    </div>
  )
}

export default Chatting
