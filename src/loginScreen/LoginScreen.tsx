import React, { useState } from 'react'
import useCookie from 'react-use-cookie'

interface userForm {
  userName: string
  userPw: string
}
function LoginScreen (): React.JSX.Element {
  const [userFrom, setUserForm] = useState<userForm>({
    userName: '',
    userPw: ''
  })
  const [, setCookies] = useCookie('userData')

  const onChangeInputValue = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserForm({ ...userFrom, [event.target.name]: event.target.value })
  }
  const loginEventHandel = (): void => {
    fetch('http://localhost:8080/login', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: userFrom.userName, pw: userFrom.userPw })
    }).then((res) => {
      setCookies(JSON.stringify(res))
    }).catch(() => {
      alert('로그인 실패!')
    })
  }
  return (
        <div>
            <div>
                <h1>Login</h1>
                <p>enter your details to sign in to your account</p>
                <input value={userFrom.userName} name={'userId'} onChange={(event) => { onChangeInputValue(event) }}/>
                <input value={userFrom.userPw} name={'userPw'} onChange={(event) => { onChangeInputValue(event) }}/>
                <button onClick={loginEventHandel}>Login In</button>
                <p>Don＇t have an account? Signup Now?</p>
            </div>
        </div>
  )
}

export default LoginScreen
