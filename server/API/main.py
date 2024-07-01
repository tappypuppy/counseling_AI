from fastapi import FastAPI, Request, Response
import logging
from pydantic import BaseModel
from AI_function import AI_output
from crud import create_log

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv



app = FastAPI()

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vercel_log_drain")

front_end_url = os.getenv('FRONT_END_URL')

origins = [
    front_end_url,  # Reactのオリジンを許可
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class Item(BaseModel):
    user_email: str
    room_id: int
    message: str
    is_audio: bool
    audio_file: str


@app.post("/input/")
def process_item(item: Item):
    output = AI_output(user_email=item.user_email, room_id=item.room_id ,message=item.message, is_audio=item.is_audio, audio_file=item.audio_file)
    # Process the input_text here
    return {"result": "Success", "output": output}


@app.post("/log_drain")
async def log_drain(request: Request, response: Response):
    payload = await request.json()
    # logger.info(f"Received log: {payload}")
    x_vercel_verify = os.getenv('X_VERCEL_VERIFY')
    response.headers["x-vercel-verify"] = x_vercel_verify

    create_log(payload)
    
    return {"status": "200"}



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)