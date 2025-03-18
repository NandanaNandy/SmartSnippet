import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

API_KEY = os.getenv("API_KEY")
API_URL = "https://api.groq.com/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "model": "llama3-8b-8192",
    "messages": [{"role": "user", "content": "Explain this Python code: def factorial(n): return 1 if n == 0 else n * factorial(n-1)"}],
    "temperature": 0.7
}

response = requests.post(API_URL, json=data, headers=headers)
print(response.json())
