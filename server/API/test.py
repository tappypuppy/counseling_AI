from dotenv import load_dotenv
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

import sys
from datetime import datetime, timedelta
from init_db import ChatLog
from settings import db_session

load_dotenv()


user = 'root'
password = 'root'
host = 'db'
db_name = 'demo'

input = '次の文章を日本語に翻訳してください。: Hello World.'
user_name = 'test_user'



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



# Create the session

session = db_session()

# Get the current time and calculate the past 24 hours
now = datetime.now()
past_24_hours = now - timedelta(hours=24)

# Query the ChatLog table with the specified conditions
results = session.query(ChatLog).filter(
    ChatLog.user_id == user_name,
    ChatLog.created_at >= past_24_hours
).order_by(ChatLog.created_at).all()

# Print the results
for result in results:
    print(result.human_message, result.ai_message)


for result in results:
    ephemeral_chat_history.add_user_message(result.human_message)
    ephemeral_chat_history.add_ai_message(result.ai_message)

ephemeral_chat_history.add_user_message(input)

response = chain.invoke(
    {
        "messeges": ephemeral_chat_history.messages,
    }

)

print(response.content)

generated_message = response.content

# 新しいメッセージを追加
new_message = ChatLog(user_id = user_name, human_message=input, ai_message=generated_message)
session.add(new_message)

# 変更をコミット
session.commit()


