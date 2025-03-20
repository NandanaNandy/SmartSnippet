// // Remove dotenv import as it is not supported in the browser environment
// const API_KEY = "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"; // Use the key directly for browser compatibility
// const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// async function explainCode(code) {
//     const messages = [
//         {
//             role: "system",
//             content: "You are a World's best Coding tutor. Explain the given code in simple terms, focusing on key concepts, structure, and purpose. Highlight important parts and use examples if needed. Mind it you are only explain programming codes other than that you should reply any other commands if there is no code given from the input you just need to reply with 'I am a code tutor, I can only explain programming codes.'"
//         },
//         {
//             role: "user",
//             content: `Explain this code clearly:\n\n${code}`
//         }
//     ];

//     try {
//         const response = await fetch(API_ENDPOINT, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${API_KEY}`
//             },
//             body: JSON.stringify({
//                 model: "llama3-8b-8192",
//                 messages: messages,
//                 temperature: 0.3
//             })
//         });

//         if (!response.ok) {
//             throw new Error(`API Error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         return data.choices[0].message.content;
//     } catch (error) {
//         console.error("Explanation error:", error);
//         throw new Error("Failed to generate explanation. Please try again.");
//     }
// }

// export default explainCode;


// // async function getAPIKey() {
// //     return new Promise((resolve, reject) => {
// //         chrome.storage.sync.get("apiKey", (data) => {
// //             if (data.apiKey) resolve(data.apiKey);
// //             else reject(new Error("API key not set"));
// //         });
// //     });
// // }

// // const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// // window.explainCode = async function (code) {
// //     const messages = [
// //         {
// //             role: "system",
// //             content: "You are a World's best Coding tutor. Explain the given code in simple terms, focusing on key concepts, structure, and purpose..."
// //         },
// //         {
// //             role: "user",
// //             content: `Explain this code clearly:\n\n${code}`
// //         }
// //     ];

// //     try {
// //         const API_KEY = await getAPIKey();

// //         const response = await fetch(API_ENDPOINT, {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 "Authorization": `Bearer ${API_KEY}`
// //             },
// //             body: JSON.stringify({
// //                 model: "llama3-8b-8192",
// //                 messages: messages,
// //                 temperature: 0.3
// //             })
// //         });

// //         if (!response.ok) {
// //             throw new Error(`API Error: ${response.statusText}`);
// //         }

// //         const data = await response.json();
// //         return data.choices[0].message.content;
// //     } catch (error) {
// //         console.error("Explanation error:", error);
// //         throw new Error("Failed to generate explanation. Please try again.");
// //     }
// // };


async function getAPIKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get("apiKey", (data) => {
            if (data.apiKey) resolve(data.apiKey);
            else reject(new Error("API key not set"));
        });
    });
}

const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// Attach function to `window` so it can be accessed globally
window.explainCode = async function (code) {
    if (!code.trim()) {
        throw new Error("No code provided for explanation.");
    }

    const messages = [
        {
            role: "system",
            content: "You are a World's best Coding tutor. Explain the given code in simple terms, focusing on key concepts, structure, and purpose. Highlight important parts and use examples if needed. Mind it you are only explaining programming codes; for any other input, reply with 'I am a code tutor, I can only explain programming codes.'"
        },
        {
            role: "user",
            content: `Explain this code clearly:\n\n${code}`
        }
    ];

    try {
        const API_KEY = await getAPIKey();

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
};
