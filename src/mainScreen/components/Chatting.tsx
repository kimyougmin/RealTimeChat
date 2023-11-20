import React from 'react'
import DataInputArea from './DataInputArea'
import MessagePrintArea from './MessagePrintArea'

function Chatting (): React.JSX.Element {
  return (
    <div className={'catting'}>
      <MessagePrintArea />
      <DataInputArea/>
    </div>
  )
}

export default Chatting
