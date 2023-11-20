import React from 'react'
import './UiMessage.css'
import type MessageUi from '../types/MessageUi'
import { useCookies } from 'react-cookie'

// eslint-disable-next-line @typescript-eslint/naming-convention
const UiMessage: React.FC<MessageUi> = ({ id, content, is_from_sender, read_status, time }): React.JSX.Element => {
  const [cookies] = useCookies(['chatUser', 'chatRoomMember', 'userData'])
  const messageFlexRender = (): React.JSX.Element | null => {
    return is_from_sender === cookies.chatRoomMember.uuid
      ? (
      <div style={{ float: 'right' }}>
        <div style={{ display: 'flex' }}>
          {read_status === 1 ? <p className={'read_status'}>{read_status}</p> : null}
          <div>
            <p className={'message_Background'}>{content}</p>
          </div>
        </div>
      </div>)
      : (
      <div style={{ float: 'left' }}>
        <div>
          <p className={'message_Background'}>{content}</p>
        </div>
        {read_status === 1 ? <p className={'read_status'}>{read_status}</p> : null}
      </div>
        )
  }
  return (
    <div className={'uiMessage'}>
      {content === undefined ? null : messageFlexRender()}
    </div>
  )
}

export default UiMessage
