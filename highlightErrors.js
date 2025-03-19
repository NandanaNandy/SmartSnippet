const API_KEY = "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";
const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

async function highlightErrors(code) {
    const messages = [{
        role: "system",
        content: "You are a senior software engineer. Analyze the code for syntax errors, potential bugs, and code smells. List errors with line numbers and suggestions for fixes."
    }, {
        role: "user",
        content: `Find errors in this code:\n\n${code}`
    }];

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
                temperature: 0.1
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error detection failed:", error);
        throw new Error("Error highlighting failed. Please check your code and try again.");
    }
}

export default highlightErrors;