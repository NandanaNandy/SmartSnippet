
async function highlightErrors(code) {
    try {
        // Get API key from storage
        const data = await new Promise((resolve) => {
            chrome.storage.sync.get("apiKey", resolve);
        });
        
        const apiKey = data.apiKey;
        if (!apiKey) {
            throw new Error("API key not set. Please set your API key in the extension options.");
        }
        
        const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
        const messages = [{
            role: "system",
            content: "You are a senior software engineer. Analyze the code for syntax errors, potential bugs, and code smells. List errors with line numbers and suggestions for fixes."
        }, {
            role: "user",
            content: `Find errors in this code:\n\n${code}`
        }];

        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: messages,
                temperature: 0.1
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData.choices[0].message.content;
    } catch (error) {
        console.error("Error detection failed:", error);
        return `Error highlighting failed: ${error.message}`;
    }
}

// Export function for use in popup
if (typeof module !== 'undefined' && module.exports) {
    module.exports = highlightErrors;
} else {
    window.highlightErrors = highlightErrors;
}