import React from 'react'
import MessageList from './components/MessageList'
import MessagePrintArea from './components/MessagePrintArea'
import DataInputArea from './components/DataInputArea'
import './MainScreen.css'

function MainScreen (): React.JSX.Element {
  return (
        <div className={'mainScreen'}>
            <MessageList />
            <div className={'conversationArea'}>
                <MessagePrintArea />
                <DataInputArea />
            </div>
        </div>
  )
}

export default MainScreen
