import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import torch
from transformers import LlamaForCausalLM, LlamaTokenizer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Auto-detect model path
MODEL_PATH = os.getenv("MODEL_PATH", "/models/llama-3")
if not os.path.exists(MODEL_PATH):
    raise RuntimeError(f"Invalid MODEL_PATH: {MODEL_PATH}")

# Load Model
tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH)
model = LlamaForCausalLM.from_pretrained(MODEL_PATH)
model.eval()

# Request format
class CodeRequest(BaseModel):
    files: List[dict]

@app.post("/analyze")
def analyze_code(request: CodeRequest):
    if not request.files:
        raise HTTPException(status_code=400, detail="No code provided")

    results = []
    for file in request.files:
        inputs = tokenizer(f"Explain the following code:\n{file['content']}", return_tensors="pt")
        with torch.no_grad():
            output_tokens = model.generate(**inputs, max_length=500)
        explanation = tokenizer.decode(output_tokens[0], skip_special_tokens=True)
        results.append({"filename": file["filename"], "analysis": explanation})

    return {"results": results}
