from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

# Load API Key from .env
load_dotenv()
API_KEY = os.getenv("API_KEY")

# Ensure API key is present
if not API_KEY:
    raise RuntimeError("API_KEY is missing. Please set it in your .env file.")

# Initialize Flask app
app = Flask(__name__)

# Groq LLM API URL
API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Function to send request to LLM API
def get_llm_response(user_prompt):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": user_prompt}],
        "temperature": 0.7
    }

    response = requests.post(API_URL, json=data, headers=headers)
    
    # Error handling
    if response.status_code != 200:
        return {"error": response.json()}
    
    return response.json()

# Route to analyze code
@app.route('/analyze-code', methods=['POST'])
def analyze_code():
    data = request.json  
    user_code = data.get("code", "")
    language = data.get("language", "unknown")

    if not user_code:
        return jsonify({"error": "No code provided"}), 400

    # Prompt for AI
    prompt = f"""
    You are a code analyzer. Review the following {language} code:
    - Detect syntax & logic errors
    - Suggest improvements
    - Provide an optimized version (if needed)
    - Identify potential security risks
    
    Code:
    {user_code}
    """

    # Get AI response
    ai_response = get_llm_response(prompt)

    return jsonify(ai_response)

# Run Flask Server
if __name__ == '__main__':
    app.run(debug=True)
