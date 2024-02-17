import React, { type KeyboardEventHandler, useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import TextField from '@mui/material/TextField'
import './Chatting.css'
import Box from '@mui/material/Box'
import TimeStampAdapter from '../../components/TimeStampAdapter'
import { io } from 'socket.io-client'
import UiMessage from '../../components/UiMessage'
import type MessageUi from '../../types/MessageUi'
import { v4 } from 'uuid'
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling'
import TimeStampUiMessageProcessing from '../../components/TimeStampUiMessageProcessing'

function Chatting (): React.JSX.Element {
  const [text, setText] = useState('')
  const [cookies, setCookie] = useCookies(['userText', 'chatUser', 'chatRoomMember', 'userData'])
  const [message, setMessage] = useState<MessageUi[]>([])
  const [observerRef, setObserverRef] = useState<null | HTMLDivElement>(null)
  const socket = io('http://localhost:8080/')

  useEffect(() => {
    if (cookies.userText !== undefined) {
      return () => {
        setCookie('userText', text)
      }
    }
    onSocket()
  }, [cookies.chatUser])

  window.addEventListener('focus', (): void | null => {
    if (cookies.chatUser.userUuid === undefined) {
      return null
    }
    fetch('http://localhost:8080/api/readMessage', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ roomUuid: cookies.chatUser.roomUuid })
    }).then(async () => { selectMessage() })
      .catch((e) => { alert(e) })
  })

  const selectMessage = useCallback(() => {
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
  }, [message])
  useInfiniteScrolling({
    observerRef,
    fetchMore: selectMessage,
    hasMore: true
  })

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
        console.log('message', message)
      }
    })
    socket.on('disconnect', function () {
      console.log('disconnected..')
    })
  }

  const chatUser = (): React.JSX.Element => {
    return (
      <div className={'messagePrint_Header'}>
        <p style={{ color: 'white', fontSize: 15 }}>{cookies.chatUser.name}</p>
      </div>
    )
  }

  const textInputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setText(e.target.value)
  }

  return (
    <TextField
      className={'textField'}
      id="outlined-multiline-static"
      label="Multiline"
      multiline
      rows={4}
      onChange={textInputHandler}
    />
  )

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
  }
  return (
    <div>
      <div className={'messagePrint'}>
        {chatUser()}
        <div className={'messageBox'}>
          {message.map((data, index): React.JSX.Element => {
            return <UiMessage id={data.id}
                              content={data.content}
                              isFromSender={data.isFromSender}
                              readStatus={data.readStatus}
                              time={TimeStampUiMessageProcessing(data.time)}
                              key={index}/>
          })}
          <div style={{ height: '10px', marginBottom: '20px', backgroundColor: 'red' }} ref={setObserverRef}></div>
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
