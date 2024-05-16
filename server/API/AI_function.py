from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ChatMessageHistory
import openai
from datetime import datetime, timedelta
from tables import User, Room, Message, Audio
from settings import db_session
from prompt import system_prompt

def get_chat_history(user_id, room_id):
    # Create the session
    session = db_session()

    # Get the current time and calculate the past 24 hours
    now = datetime.now()
    past_24_hours = now - timedelta(hours=24)

    # Query the ChatLog table with the specified conditions
    past_chats = session.query(Message).filter(
        Message.user_id == user_id,
        Message.room_id == room_id,
        Message.created_at >= past_24_hours
    ).order_by(Message.created_at).all()

    print(past_chats)

    # Close the session
    session.close()
    return past_chats



def AI_output(user_name,room_name, message, is_audio, audio_file):
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

    # Query the User table to get the user_id based on the user_name
    user = session.query(User).filter(User.user_name == user_name).first()
    if not user:
        new_user = User(user_name=user_name)
        session.add(new_user)
        session.commit()
    user_id = session.query(User).filter(User.user_name == user_name).first().id
    # Check if the user_id and room_id combination exists in the Room table
    existing_room = session.query(Room).filter(Room.user_id == user_id, Room.room_name == room_name).first()

    # If the combination does not exist, create a new row in the Room table
    if not existing_room:
        new_room = Room(user_id=user_id, room_name=room_name)
        session.add(new_room)
        session.commit()
    
    # Get the room_id based on the user_id and room_name
    room_id = session.query(Room).filter(Room.user_id == user_id, Room.room_name == room_name).first().id
    
    session.close()
    
    # Get the chat history
    chat_histories = get_chat_history(user_id, room_id)

    # Add the chat history to the ephemeral_chat_history
    for past_chat in chat_histories:
        if past_chat.sender == "AI":
            ephemeral_chat_history.add_ai_message(past_chat.message)
        else:
            ephemeral_chat_history.add_user_message(past_chat.message)

    ephemeral_chat_history.add_user_message(message)

    # Invoke the chain
    response = chain.invoke(
        {
            "messeges": ephemeral_chat_history.messages,
        }

    )

    print(response.content)

    generated_message = response.content

    # 新しいメッセージを追加
    session = db_session()
    new_user_message = Message(user_id = user_id, room_id = room_id, message=message, sender="user")
    new_ai_message = Message(user_id = user_id, room_id = room_id, message=generated_message, sender="AI")
    session.add(new_user_message)
    session.add(new_ai_message)

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




