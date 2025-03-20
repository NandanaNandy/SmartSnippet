document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("saveButton");
    const apiKeyInput = document.getElementById("apiKey");
    const messageElement = document.getElementById("message");

    // Load saved API key
    chrome.storage.local.get(['apiKey'], (result) => {
        if (result.apiKey) {
            apiKeyInput.placeholder = "••••••••••••••••";
        }
    });

    saveButton.addEventListener("click", () => {
        const apiKey = apiKeyInput.value.trim();

        if (apiKey) {
            chrome.storage.local.set({ apiKey }, () => {
                showMessage("API key saved successfully!", "#28a745");
                apiKeyInput.value = "";
                apiKeyInput.placeholder = "••••••••••••••••";
            });
        } else {
            showMessage("Please enter a valid API key", "#dc3545");
        }
    });

    function showMessage(text, color) {
        messageElement.textContent = text;
        messageElement.style.color = color;
        setTimeout(() => messageElement.textContent = "", 3000);
    }
});

