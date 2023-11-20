import React, { } from 'react'
import ChatRoom from './components/ChatRoom'
import './MainScreen.css'
import Chatting from './components/Chatting'

function MainScreen (): React.JSX.Element {
  // const [cookies, setCookie] = useCookies(['userData'])
  // const navi = useNavigate()
  // useEffect(() => {
  //   if (cookies.userData === undefined) {
  //     navi('/')
  //   }
  // }, [cookies.userData])
  return (
    <div className={'mainScreen'}>
      <ChatRoom />
      <div className={'conversationArea'}>
        <Chatting />
      </div>
    </div>
  )
}

export default MainScreen
