// // Extension installed event
// chrome.runtime.onInstalled.addListener(() => {
//     console.log("GitHub Code Fetcher Extension Installed.");
// });

// // Listen for messages from content script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "explainCode") {
//         chrome.storage.sync.get("apiKey", function(data) {
//             const apiKey = data.apiKey || "";
            
//             if (!apiKey) {
//                 chrome.tabs.sendMessage(sender.tab.id, {
//                     action: "displayExplanation",
//                     explanation: "⚠ API key not set. Please set your API key in the extension options."
//                 });
//                 return;
//             }

//             fetch("http://localhost:5000/explain", {
//                 method: "POST",
//                 headers: { 
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${apiKey}`
//                 },
//                 body: JSON.stringify({ code: request.code })
//             })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`Server responded with ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 chrome.tabs.sendMessage(sender.tab.id, {
//                     action: "displayExplanation",
//                     explanation: data.explanation || "No explanation available."
//                 });
//             })
//             .catch(error => {
//                 console.error("API error:", error);
//                 chrome.tabs.sendMessage(sender.tab.id, {
//                     action: "displayExplanation",
//                     explanation: `⚠ API request failed: ${error.message}. Check API key and server.`
//                 });
//             });
//         });

//         return true; // Indicates async response
//     }
// });

// // Toolbar button click event
// chrome.action.onClicked.addListener((tab) => {
//     chrome.tabs.sendMessage(tab.id, { action: "toggle" });
// });

// chrome.runtime.onInstalled.addListener(() => {
//     console.log("GitHub Code Fetcher Extension Installed.");
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "fetchCode") {
//         chrome.scripting.executeScript({
//             target: { tabId: sender.tab.id },
//             function: extractCode
//         }, (injectionResults) => {
//             if (chrome.runtime.lastError) {
//                 console.error(chrome.runtime.lastError.message);
//                 sendResponse({ error: "Failed to execute script." });
//                 return;
//             }

//             if (!injectionResults || !injectionResults[0] || !injectionResults[0].result) {
//                 sendResponse({ error: "No code extracted." });
//                 return;
//             }

//             sendResponse({ code: injectionResults[0].result });
//         });
//         return true;
//     }
// });


// Extension installed event
chrome.runtime.onInstalled.addListener(() => {
    console.log("SmartSnippet Extension Installed.");
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "explainCode") {
        chrome.storage.sync.get("apiKey", function(data) {
            const apiKey = data.apiKey || "";
            
            if (!apiKey) {
                sendResponse({ error: "⚠ API key not set. Please set your API key in the extension options." });
                return;
            }

            const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";  // Ensure API URL is correct

            fetch(API_ENDPOINT, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [
                        { role: "system", content: "Explain this code in simple terms." },
                        { role: "user", content: request.code }
                    ],
                    temperature: 0.3
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error("API Error:", data.error.message);
                    sendResponse({ error: `⚠ API Error: ${data.error.message}` });
                    return;
                }
                sendResponse({ explanation: data.choices[0].message.content || "No explanation available." });
            })
            .catch(error => {
                console.error("API request failed:", error);
                sendResponse({ error: `⚠ API request failed: ${error.message}` });
            });

        });

        return true; // Keeps sendResponse async
    }
});

// Handle GitHub Code Extraction
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchCode") {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            function: extractCode
        }, (injectionResults) => {
            if (chrome.runtime.lastError) {
                console.error("Script Execution Error:", chrome.runtime.lastError.message);
                sendResponse({ error: "Failed to execute script." });
                return;
            }

            if (!injectionResults || !injectionResults[0] || !injectionResults[0].result) {
                sendResponse({ error: "No code extracted." });
                return;
            }

            sendResponse({ code: injectionResults[0].result });
        });

        return true; // Keeps sendResponse async
    }
});

// Toolbar button click event
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "toggle" });
});
