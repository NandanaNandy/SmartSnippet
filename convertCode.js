// console.log("convertCode.js loaded");

// function escapeHTML(text) {
//     return text.replace(/&/g, "&amp;")
//                .replace(/</g, "&lt;")  // Ensures < is displayed correctly
//                .replace(/>/g, "&gt;")  // Ensures > is displayed correctly
//                .replace(/"/g, "&quot;")
//                .replace(/'/g, "&#39;");
// }

// async function convertCode(code, targetLanguage) {
//     return new Promise((resolve, reject) => {
//         chrome.storage.sync.get("apiKey", async function(data) {
//             const apiKey = data.apiKey || "";
//             if (!apiKey) {
//                 console.error("API key missing.");
//                 reject("API key is not set. Please configure it in extension options.");
//                 return;
//             }

//             const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
//             const escapedCode = escapeHTML(code);
//             const messages = [
//                 {
//                     role: "system",
//                     content: `You are the world's biggest code conversion expert. Convert the provided code to ${targetLanguage} while maintaining functionality.

//                     ### Key Requirements:
//                     - Ensure that the converted ${targetLanguage} code is fully functional and error-free.
//                     - *Import all necessary libraries* (e.g., #include <iostream>, #include <vector> for C++).
//                     - The syntax must be *100% correct* with no type errors.
//                     - **Use correct includes** in C++ (e.g., \`#include &lt;bits/stdc++.h&gt;\`).
//                     - If converting to C++, *always include required preprocessor directives* (#include statements).
//                     - Use *appropriate data structures and methods* equivalent to the original language.
//                     - Add meaningful *comments* explaining key changes in the converted code.
//                     - The conversion should be *executable without modifications*.

//                     ### Input Code:
//                     \`${targetLanguage}
//                     ${code}
//                     \`

//                     ### Output Code in ${targetLanguage}:
//                     \`${targetLanguage}
//                     `
//                 },
//                 {
//                     role: "user",
//                     content: `Convert this code to ${targetLanguage}:

// ${code}`
//                 }
//             ];

//             try {
//                 const response = await fetch(API_ENDPOINT, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${apiKey}`
//                     },
//                     body: JSON.stringify({
//                         model: "llama3-8b-8192",
//                         messages: messages,
//                         temperature: 0.2
//                     })
//                 });

//                 if (!response.ok) {
//                     throw new Error(`API Error: ${response.statusText}`);
//                 }

//                 const data = await response.json();
//                 resolve(data.choices[0].message.content);
//             } catch (error) {
//                 console.error("Conversion error:", error);
//                 reject("Conversion failed. Please check the code and try again.");
//             }
//         });
//     });
// }

// window.convertCode = convertCode;


console.log("convertCode.js loaded");

function escapeHTML(text) {
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")  // Encode `<`
               .replace(/>/g, "&gt;")  // Encode `>`
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#39;");
}

async function convertCode(code, targetLanguage) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get("apiKey", async function(data) {
            const apiKey = data.apiKey || "";
            if (!apiKey) {
                console.error("API key missing.");
                reject("API key is not set. Please configure it in extension options.");
                return;
            }

            const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
            const escapedCode = escapeHTML(code);

            const messages = [
                {
                    role: "system",
                    content: `You are the world's biggest code conversion expert. Convert the provided code to ${targetLanguage} while maintaining functionality.

                    ### Key Requirements:
                    - Ensure that the converted ${targetLanguage} code is **fully functional and error-free**.
                    - **Use correct includes in C++**, e.g., \`#include &lt;bits/stdc++.h&gt;\`.
                    - **DO NOT modify** \`#include <bits/stdc++.h>\`—keep it exactly as written.
                    - The syntax must be **100% correct**.
                    - Return the output inside **triple backticks (\`\`\`)** to preserve formatting.

                    ### Input Code:
                    \`\`\`${targetLanguage}
                    ${escapedCode}
                    \`\`\`

                    ### Output Code in ${targetLanguage}:
                    \`\`\`${targetLanguage}
                    `
                },
                {
                    role: "user",
                    content: `Convert this code to ${targetLanguage}. Ensure:

                    - \`#include &lt;bits/stdc++.h&gt;\` is correctly formatted.
                    - The response remains inside triple backticks (\`\`\`cpp).

                    Here is the code:

                    \`\`\`${targetLanguage}
                    ${escapedCode}
                    \`\`\`
                    `
                }
            ];

            try {
                const response = await fetch(API_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
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

                let data = await response.json();
                let convertedCode = escapeHTML(data.choices[0].message.content); // Escape AI response

                resolve(convertedCode);
            } catch (error) {
                console.error("Conversion error:", error);
                reject("Conversion failed. Please check the code and try again.");
            }
        });
    });
}

window.convertCode = convertCode;
