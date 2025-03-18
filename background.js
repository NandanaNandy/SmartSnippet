// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "explainCode") {
//         fetch("http://localhost:5000/explain", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ code: request.code })
//         })
//         .then(response => response.json())
//         .then(data => {
//             chrome.tabs.sendMessage(sender.tab.id, {
//                 action: "displayExplanation",
//                 explanation: data.explanation
//             });
//         })
//         .catch(error => {
//             chrome.tabs.sendMessage(sender.tab.id, {
//                 action: "displayExplanation",
//                 explanation: "Failed to fetch explanation. Try again later."
//             });
//         });

//         return true; // Indicates async response
//     }
// });

// // Browser action (toolbar button) click event
// chrome.action.onClicked.addListener((tab) => {
//     chrome.tabs.sendMessage(tab.id, { action: "toggle" });
// });

// // Add any additional background tasks here
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "explainCode") {
        chrome.storage.sync.get("apiKey", function(data) {
            const apiKey = data.apiKey || "YOUR_DEFAULT_KEY";

            fetch("http://localhost:5000/explain", {  // Calls local API
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({ code: request.code })
            })
            .then(response => response.json())
            .then(data => {
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: "displayExplanation",
                    explanation: data.explanation || "No explanation available."
                });
            })
            .catch(error => {
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: "displayExplanation",
                    explanation: "⚠ API request failed. Check API key and server."
                });
            });
        });

        return true; // Indicates async response
    }
});

// Toolbar button click event
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "toggle" });
});
