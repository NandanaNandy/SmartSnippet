import requests

API_URL = "http://127.0.0.1:5000/analyze-code"

data = {
    "code": "def factorial(n): return 1 if n == 0 else n * factorial(n-1)",
    "language": "Python"
}

response = requests.post(API_URL, json=data)
print(response.json())  # Print API Response
