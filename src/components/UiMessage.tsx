import React from 'react'
import './UiMessage.css'
import type MessageUi from '../types/MessageUi'
import { useCookies } from 'react-cookie'

const UiMessage: React.FC<MessageUi> = ({ id, content, isFromSender, readStatus, time }): React.JSX.Element => {
  const [cookies] = useCookies(['chatUser', 'chatRoomMember', 'userData'])
  const messageFlexRender = (): React.JSX.Element | null => {
    return isFromSender === cookies.userData.uuid
      ? (
        <div style={{ float: 'right', display: 'flex' }}>
          <div className={'messageStatus'}>
            {readStatus === 1 ? <p className={'read_status'}>{readStatus}</p> : null}
            <p className={'messageTime'}>{time}</p>
          </div>
          <div style={{ marginLeft: 20 }}>
            <p className={'message_Background'}>{content}</p>
          </div>
        </div>)
      : (
        <div style={{ float: 'left', display: 'flex' }}>
          <div style={{ marginRight: 5 }}>
            <p className={'message_Background'}>{content}</p>
          </div>
          <div className={'messageStatus'}>
            {readStatus === 1 ? <p className={'read_status'}>{readStatus}</p> : null}
            <p className={'messageTime'}>{time}</p>
          </div>
        </div>
        )
  }
  return (
    <div className={'uiMessage'}>
      {id === undefined ? null : messageFlexRender()}
    </div>
  )
}

export default UiMessage
