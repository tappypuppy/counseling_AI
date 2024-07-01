from dotenv import load_dotenv
import os
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions

def create_log(payload):
    load_dotenv()
    # Create the session
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")

    supabase: Client = create_client(url, key)

    data, count = supabase.table('front_json_logs').insert({"json_log": payload}).execute()
    # print(data)
    return data[1]