from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ChatMessageHistory
import openai
from datetime import datetime, timedelta
from ChatLog import ChatLog
from settings import db_session
from prompt import system_prompt

def get_chat_history(user_id):
    # Create the session
    session = db_session()

    # Get the current time and calculate the past 24 hours
    now = datetime.now()
    past_24_hours = now - timedelta(hours=24)

    # Query the ChatLog table with the specified conditions
    past_chats = session.query(ChatLog).filter(
        ChatLog.user_id == user_id,
        ChatLog.created_at >= past_24_hours
    ).order_by(ChatLog.created_at).all()

    print(past_chats)

    # Close the session
    session.close()
    return past_chats



def AI_output(user_id,input):
    load_dotenv()
    # chat = ChatOpenAI(model="gpt-4-turbo-2024-04-09")
    chat = ChatOpenAI(model="gpt-3.5-turbo")

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                system_prompt,
            ),
            MessagesPlaceholder(variable_name="messeges"),
            
        ]
    )

    chain = prompt | chat

    # add the chat history
    ephemeral_chat_history = ChatMessageHistory()

    # Create the session
    session = db_session()

    chat_histories = get_chat_history(user_id)

    for past_chat in chat_histories:
        ephemeral_chat_history.add_user_message(past_chat.human_message)
        ephemeral_chat_history.add_ai_message(past_chat.ai_message)

    ephemeral_chat_history.add_user_message(input)

    response = chain.invoke(
        {
            "messeges": ephemeral_chat_history.messages,
        }

    )

    print(response.content)

    generated_message = response.content

    # 新しいメッセージを追加
    new_message = ChatLog(user_id = user_id, human_message=input, ai_message=generated_message)
    session.add(new_message)

    # 変更をコミット
    session.commit()
    
    return generated_message





def speech_to_text(file_path):
    load_dotenv()
    client  = openai.OpenAI()
    with open(file_path, "rb") as file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=file,
            language="ja",) 
    return transcript.text




