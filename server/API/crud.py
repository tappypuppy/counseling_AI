from dotenv import load_dotenv
import os
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
import datetime

def create_room(user_email):
    load_dotenv()
    # Create the session
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")

    auth_opts = ClientOptions().replace(schema='next_auth')
    supabase_auth: Client = create_client(url, key, auth_opts)
    supabase: Client = create_client(url, key)

    user_id_data = supabase_auth.table('users').select("id").eq('email', user_email).execute()
    user_id = user_id_data.data[0]['id']

    data, count = supabase.table('rooms').insert({"user_id": user_id}).execute()
    room_id = data[1][0]['id']

    return room_id

def get_messages(room_id):
    load_dotenv()
    # Create the session
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")

    supabase: Client = create_client(url, key)

    data, count = supabase.table('messages').select("message, sender").eq('room_id', room_id).execute()
    print(data[1])
    return data[1]

def create_log(payload):
    load_dotenv()
    # Create the session
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")

    supabase: Client = create_client(url, key)

    payload['timestamp'] = datetime.datetime.fromtimestamp(payload['timestamp'])

    data, count = supabase.table('front_logs').insert(payload).execute()
    return data[1]