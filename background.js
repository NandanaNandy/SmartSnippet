chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "explainCode") {
        fetch("http://localhost:5000/explain", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: request.code })
        })
        .then(response => response.json())
        .then(data => {
            chrome.tabs.sendMessage(sender.tab.id, {
                action: "displayExplanation",
                explanation: data.explanation
            });
        })
        .catch(error => {
            chrome.tabs.sendMessage(sender.tab.id, {
                action: "displayExplanation",
                explanation: "Failed to fetch explanation. Try again later."
            });
        });

        return true; // Indicates async response
    }
});
