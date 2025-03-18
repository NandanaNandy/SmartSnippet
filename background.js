<<<<<<< HEAD
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, { action: "toggle" });
});

// Add any additional background tasks here
=======
chrome.runtime.onInstalled.addListener(() => {
    console.log("GitHub to Llama Extension Installed!");
});
>>>>>>> 3a31fc3c326b82b905c6fe214379184f5000d52d
