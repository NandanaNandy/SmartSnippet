// Remove dotenv import as it is not supported in the browser environment
const API_KEY = "Enter Your API Key"; // Use the key directly for browser compatibility
const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

async function explainCode(code) {
    const messages = [
        {
            role: "system",
            content: "You are a expert programming tutor. Explain the given code in simple terms, focusing on key concepts, structure, and purpose. Highlight important parts and use examples if needed."
        },
        {
            role: "user",
            content: `Explain this code clearly:\n\n${code}`
        }
    ];

    try {
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: messages,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Explanation error:", error);
        throw new Error("Failed to generate explanation. Please try again.");
    }
}

export default explainCode;