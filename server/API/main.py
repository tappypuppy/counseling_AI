from fastapi import FastAPI
from pydantic import BaseModel
from AI_function import AI_output

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.post("/input/")
def process_item(item: Item):
    print(item)
    output = AI_output(item.user_id, item.input_text)
    # Process the input_text here
    return {"result": "Success", "output": output}
