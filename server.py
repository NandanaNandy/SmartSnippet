from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import torch
from transformers import LlamaForCausalLM, LlamaTokenizer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS (so Chrome Extension can call this API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load LLaMA Model & Tokenizer
MODEL_PATH = "path/to/your/local/llama"
try:
    tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH)
    model = LlamaForCausalLM.from_pretrained(MODEL_PATH)
    model.eval()  # Set to evaluation mode
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

# Define request format
class CodeFile(BaseModel):
    filename: str
    content: str

class CodeRequest(BaseModel):
    files: List[CodeFile]

@app.post("/analyze")
def analyze_code(request: CodeRequest):
    if not request.files:
        raise HTTPException(status_code=400, detail="No code files provided.")

    results = []
    for file in request.files:
        try:
            input_text = f"Explain the following code:\n\n{file.content}\n\nProvide a clear, concise breakdown."
            inputs = tokenizer(input_text, return_tensors="pt", truncation=True, max_length=1024)

            with torch.no_grad():
                output_tokens = model.generate(**inputs, max_length=500)

            explanation = tokenizer.decode(output_tokens[0], skip_special_tokens=True)
            results.append({"filename": file.filename, "analysis": explanation})

        except Exception as e:
            results.append({"filename": file.filename, "error": f"Analysis failed: {str(e)}"})

    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
