'use client'

import React from 'react'
import { RecoilRoot, useRecoilState } from 'recoil'
import ChatMessage from './ChatMessage'
import ChatForm from './ChatForm'

const ChatClient = () => {
  return (
    <RecoilRoot >
      {/* <!-- メッセージエリア --> */}
      <div className="flex-grow overflow-auto p-6 space-y-5 ">
          <ChatMessage />
      </div>
  
      {/* <!-- テキスト入力フォーム --> */}
      <ChatForm />

    </RecoilRoot>
  )
}

export default ChatClient