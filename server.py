from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS

# Load API Key from .env
load_dotenv()
API_KEY = os.getenv("API_KEY")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Ensure API key is present
if not API_KEY:
    raise RuntimeError("API_KEY is missing. Please set it in your .env file.")

# Groq LLM API URL
API_URL = "https://api.groq.com/openai/v1/chat/completions"

@app.route("/explain", methods=["POST"])
def explain_code():
    data = request.json
    code = data.get("code", "")
    
    if not code:
        return jsonify({"error": "No code provided"}), 400
    
    # Get API key from request header if provided
    auth_header = request.headers.get('Authorization')
    api_key = API_KEY  # Default to env variable
    
    if auth_header and auth_header.startswith('Bearer '):
        provided_key = auth_header.split(' ')[1]
        if provided_key and provided_key != "YOUR_DEFAULT_KEY":
            api_key = provided_key
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are an expert programming tutor. Explain the given code in simple terms, focusing on key concepts, structure, and purpose."},
            {"role": "user", "content": f"Explain this code clearly:\n\n{code}"}
        ],
        "temperature": 0.3
    }

    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors
        
        ai_response = response.json()
        explanation = ai_response.get("choices", [{}])[0].get("message", {}).get("content", "No explanation generated.")
        
        return jsonify({"explanation": explanation})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

# Route to analyze code for errors
@app.route('/analyze', methods=['POST'])
def analyze_code():
    data = request.json  
    code = data.get("code", "")
    
    if not code:
        return jsonify({"error": "No code provided"}), 400

    # Get API key from request header if provided
    auth_header = request.headers.get('Authorization')
    api_key = API_KEY  # Default to env variable
    
    if auth_header and auth_header.startswith('Bearer '):
        provided_key = auth_header.split(' ')[1]
        if provided_key and provided_key != "YOUR_DEFAULT_KEY":
            api_key = provided_key

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a senior software engineer. Analyze the code for syntax errors, potential bugs, and code smells."},
            {"role": "user", "content": f"Find errors in this code:\n\n{code}"}
        ],
        "temperature": 0.1
    }

    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        ai_response = response.json()
        analysis = ai_response.get("choices", [{}])[0].get("message", {}).get("content", "No analysis generated.")
        
        return jsonify({"analysis": analysis})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

# Run Flask Server
if __name__ == '__main__':
    app.run(debug=True, port=5000)