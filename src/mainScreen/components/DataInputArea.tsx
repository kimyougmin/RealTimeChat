import React, { type KeyboardEventHandler, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import { useCookies } from 'react-cookie'
import './DataInputArea.css'
import Box from '@mui/material/Box'
import TimeStampAdapter from '../../components/TimeStampAdapter'

function DataInputArea (): React.JSX.Element {
  const [text, setText] = useState('')
  const [cookies, setCookie] = useCookies(['userText', 'userData', 'chatUser'])

  useEffect(() => {
    if (cookies.userText !== undefined) {
      return () => {
        setCookie('userText', text)
      }
    }
  }, [text])
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
        uuid: cookies.userData.uuid,
        createdAt: TimeStampAdapter(Date.now()),
        userUuid: cookies.chatUser.userUuid,
        message: text
      }
      console.log('sendFormat', sendFormat)
      fetch('http://localhost:8080/api/send', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(sendFormat)
      }).then(async (res) => {
        const data = res.json()
        console.log(data)
        setText('')
        console.log('전송 성공')
      }).catch(() => {
        console.log('전송 실패')
      })
    }
  }
  return (
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
  )
}
export default DataInputArea
