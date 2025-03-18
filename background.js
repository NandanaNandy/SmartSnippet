chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, { action: "toggle" });
});

// Add any additional background tasks here
