from fastapi import FastAPI
from pydantic import BaseModel
from AI_function import AI_output

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

class Item(BaseModel):
    user_id: str
    input_text: str

@app.post("/input/")
def process_item(item: Item):
    output = AI_output(item.user_id, item.input_text)
    # Process the input_text here
    return {"result": "Success", "output": output}
