from fastapi import FastAPI
from pydantic import BaseModel
from AI_function import AI_output

from fastapi import FastAPI,UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import os


app = FastAPI()

origins = [
    "http://localhost:3000",  # Reactのオリジンを許可
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
    user_id: str
    input_text: str

class Audio(BaseModel):
    audio: bytes

@app.post("/input/")
def process_item(item: Item):
    print(item)
    output = AI_output(item.user_id, item.input_text)
    # Process the input_text here
    return {"result": "Success", "output": output}


@app.post("/audio_input/")
async def upload_audio(audio: UploadFile = File(...)):
    contents = await audio.read()
    # Save the audio file
    print(type(contents))
    file_path = os.path.join("./src", 'test.wav')
    with open(file_path, "wb") as file:
        file.write(contents)

    return JSONResponse(content={"filename": audio.filename})
