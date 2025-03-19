# # import requests
# # import os
# # from dotenv import load_dotenv

# # # Load environment variables from .env
# # load_dotenv()

# # API_KEY = os.getenv("API_KEY")
# # API_URL = "https://api.groq.com/openai/v1/chat/completions"

# # headers = {
# #     "Authorization": f"Bearer {API_KEY}",
# #     "Content-Type": "application/json"
# # }

# # data = {
# #     "model": "llama3-8b-8192",
# #     "messages": [{"role": "user", "content": "Explain this Python code: def factorial(n): return 1 if n == 0 else n * factorial(n-1)"}],
# #     "temperature": 0.7
# # }

# # response = requests.post(API_URL, json=data, headers=headers)
# # print(response.json())
# from flask import Flask, request, jsonify
# import os
# import requests
# from dotenv import load_dotenv

# app = Flask(__name__)

# # Load environment variables
# load_dotenv()

# # Get API Key from .env
# API_KEY = os.getenv("API_KEY")
# if not API_KEY:
#     raise ValueError("❌ API_KEY not found. Check your .env file.")

# # AI Model API (Groq/LLaMA)
# API_URL = "https://api.groq.com/openai/v1/chat/completions"

# @app.route("/explain", methods=["POST"])
# def explain_code():
#     data = request.json
#     code = data.get("code", "")

#     if not code:
#         return jsonify({"error": "No code provided"}), 400

#     # Send request to LLaMA/Groq API
#     headers = {
#         "Authorization": f"Bearer {API_KEY}",
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "model": "llama3-8b-8192",  # Ensure model is available on Groq
#         "messages": [{"role": "user", "content": f"Explain this code:\n{code}"}],
#         "temperature": 0.7
#     }

#     response = requests.post(API_URL, json=payload, headers=headers)
#     ai_response = response.json()

#     # Extract explanation
#     explanation = ai_response.get("choices", [{}])[0].get("message", {}).get("content", "No explanation generated.")

#     return jsonify({"explanation": explanation})

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)
