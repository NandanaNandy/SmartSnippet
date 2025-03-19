const API_KEY = "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";
const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

async function convertCode(code, targetLanguage) {
    const messages = [{
        role: "system",
        content: `You are a code conversion expert. Convert the provided code to ${targetLanguage} while maintaining functionality. Include comments explaining key changes.`
    }, {
        role: "user",
        content: `Convert this code to ${targetLanguage}:\n\n${code}`
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
                temperature: 0.2
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Conversion error:", error);
        throw new Error("Conversion failed. Please check the code and try again.");
    }
}

export default convertCode;