'use client'
import React, { useState } from 'react'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { chatLogState } from '../../../states/chatLogState'

const ChatForm = () => {

  const [input, setInput] = useState<string>("")
  const [chatLog, setChatLog] = useRecoilState(chatLogState)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gray-200 flex justify-between items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 mr-2 rounded focus:outline-none text-gray-800" 
        placeholder="メッセージを入力..."
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        送信
      </button>
    </form>
  )
}

export default ChatForm