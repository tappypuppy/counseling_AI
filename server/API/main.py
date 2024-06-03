from fastapi import FastAPI
from pydantic import BaseModel
from AI_function import AI_output, speech_to_text
from crud import create_room, get_messages

from fastapi import FastAPI,UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv



app = FastAPI()

load_dotenv()

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

@app.get("/")
def read_root():
    return {"Hello": "World"}

class Item(BaseModel):
    user_email: str
    room_id: int
    message: str
    is_audio: bool
    audio_file: str

class Room(BaseModel):
    user_email: str


@app.post("/input/")
def process_item(item: Item):
    output = AI_output(user_email=item.user_email, room_id=item.room_id ,message=item.message, is_audio=item.is_audio, audio_file=item.audio_file)
    # Process the input_text here
    return {"result": "Success", "output": output}

@app.post('/create_room/')
def room(room: Room):
    room_id = create_room(room.user_email)
    return {'room_id': room_id}

@app.get('/messages/{room_id}')
def messages(room_id: int):
    messages = get_messages(room_id)
    return {'messages': messages}


@app.post("/audio_input/")
async def upload_audio(audio: UploadFile = File(...)):
    contents = await audio.read()
    filename = 'test.wav'
    # Save the audio file
    file_path = os.path.join("./src", filename)
    with open(file_path, "wb") as file:
        file.write(contents)
    

    text = speech_to_text(file_path)
    output = AI_output("test", text)
    print(text)

    return {"result": "Success", "output": output}

@app.post("/log-drain/")
def log_drain(json: dict):
    print(json)
    return {"result": "Success"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)