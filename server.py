from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import LlamaForCausalLM, LlamaTokenizer

app = FastAPI()

# Load the Llama model
model_name = "path/to/your/local/llama"
tokenizer = LlamaTokenizer.from_pretrained(model_name)
model = LlamaForCausalLM.from_pretrained(model_name)

class CodeRequest(BaseModel):
    files: list

@app.post("/analyze")
def analyze_code(request: CodeRequest):
    results = []
    for file in request.files:
        input_text = f"Analyze this code:\n{file['content']}"
        inputs = tokenizer(input_text, return_tensors="pt")

        with torch.no_grad():
            outputs = model.generate(**inputs, max_length=500)

        result_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        results.append({"filename": file["filename"], "analysis": result_text})

    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
