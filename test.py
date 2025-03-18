import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from .env
API_KEY = os.getenv("API_KEY")

# Ensure API Key is loaded correctly
if not API_KEY:
    raise ValueError("❌ API_KEY not found. Check your .env file.")

# Updated API URL (Groq)
API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Headers for the request
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Request payload
data = {
    "model": "llama3-8b-8192",  # Ensure this model is supported by Groq
    "messages": [{"role": "user", "content": "Explain this Python code: def factorial(n): return 1 if n == 0 else n * factorial(n-1)"}],
    "temperature": 0.7
}

# Send request
response = requests.post(API_URL, json=data, headers=headers)

# Print response
print("🔄 Response Status Code:", response.status_code)
print("📩 Response JSON:", response.json())
