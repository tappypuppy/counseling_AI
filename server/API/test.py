from dotenv import load_dotenv
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

import sys

load_dotenv()
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")



chat = ChatOpenAI(model="gpt-3.5-turbo-1106")


prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant. Answer all questions to the best of your ability.",
        ),
        MessagesPlaceholder(variable_name="messeges"),
    ]
)

chain = prompt | chat


ephemeral_chat_history = ChatMessageHistory()

input1 = "Translate this sentence from English to French: I love programming."
ephemeral_chat_history.add_user_message(input1)

response = chain.invoke(
    {
        "messeges": ephemeral_chat_history.messages,
    }
)

ephemeral_chat_history.add_ai_message(response)

input2 = "What did I just ask you?"

ephemeral_chat_history.add_user_message(input2)

chain.invoke(
    {
        "messeges": ephemeral_chat_history.messages,
    }
)

