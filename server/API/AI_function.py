from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ChatMessageHistory
import openai
from prompt import system_prompt

import os
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions

def get_chat_history(user_id:str, room_id:int):
    # load environment variables
    load_dotenv()
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")

    # Create the session
    supabase: Client = create_client(url, key)

    # Get the current time and calculate the past 24 hours
    # now = datetime.now()
    # past_24_hours = now - timedelta(hours=24)

    # Query the messages table with the specified conditions
    past_chats = supabase.table('messages').select("message,sender").eq('user_id', user_id).eq('room_id', room_id).execute()
    print(past_chats.data)

    return past_chats.data




def AI_output(user_email:str,room_id:int, message:str, is_audio:bool, audio_file:str):
    load_dotenv()
    # chat = ChatOpenAI(model="gpt-4-turbo-2024-04-09")
    # chat = ChatOpenAI(model="gpt-3.5-turbo")
    chat = ChatOpenAI(model="gpt-4o-2024-05-13")

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
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")

    auth_opts = ClientOptions().replace(schema='next_auth')
    supabase_auth: Client = create_client(url, key, auth_opts)
    supabase: Client = create_client(url, key)

    user_id_data = supabase_auth.table('users').select("id").eq('email', user_email).execute()
    user_id = user_id_data.data[0]['id']
    
    # Get the chat history
    chat_histories = get_chat_history(user_id, room_id)

    # Add the chat history to the ephemeral_chat_history
    for past_chat in chat_histories:
        if past_chat['sender'] == "AI":
            ephemeral_chat_history.add_ai_message(past_chat['message'])
        else:
            ephemeral_chat_history.add_user_message(past_chat['message'])

    ephemeral_chat_history.add_user_message(message)

    # Invoke the chain
    response = chain.invoke(
        {
            "messeges": ephemeral_chat_history.messages,
        }

    )

    print(response.content)

    generated_message = response.content

    data, count = supabase.table('messages').insert({"user_id": user_id, "room_id": room_id, "message": message, "sender": "user"}).execute()
    data, count = supabase.table('messages').insert({"user_id": user_id, "room_id": room_id, "message": generated_message, "sender": "AI"}).execute()
    
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




