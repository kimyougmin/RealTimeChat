import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '@mui/material'

interface userFrom {
  id: string
  name: string
  pw: string
}
function SignUpScreen (): React.JSX.Element {
  const [userForm, setUserForm] = useState<userFrom>({
    id: uuidv4(),
    name: '',
    pw: ''
  })
  const navi = useNavigate()
  const onChangeInputValue = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setUserForm({ ...userForm, [event.target.name]: event.target.value })
    console.log(userForm.id)
  }
  const signUpEventHandel = (): void => {
    fetch('http://localhost:8080/api/signup', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: userForm.id, name: userForm.name, password: userForm.pw })
    }).then((res) => {
      if (res.status === 200) {
        navi('/')
      }
    }).catch(() => {
      alert('로그인 실패!')
    })
  }
  return (
        <div className={'singUpScreen'}>
            <Input name={'name'}
                   value={userForm.name}
                   placeholder={'닉네임을 입력해주세요'}
                   onChange={(event) => { onChangeInputValue(event) }}/>
          <Input name={'pw'}
                 value={userForm.pw}
                 placeholder={'비밀번호을 입력해주세요'}
                 onChange={(event) => { onChangeInputValue(event) }}/>
          <Button onClick={signUpEventHandel}>회원 가입</Button>
        </div>
  )
}

export default SignUpScreen
