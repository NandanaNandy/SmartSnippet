// document.addEventListener("DOMContentLoaded", async () => {
//     const actionSelect = document.getElementById("actionSelect");
//     const languageSelector = document.getElementById("languageSelector");
//     const codeInput = document.getElementById("codeInput");
//     const runAction = document.getElementById("runAction");
//     const output = document.getElementById("output");
//     const languageInput = document.getElementById("languageInput"); // Ensure this exists

//     async function fetchGitHubCode() {
//         let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//         if (!tab || !tab.url.includes("github.com")) {
//             console.warn("Not a GitHub file page.");
//             return;
//         }

//         let urlParts = tab.url.split("/");
//         if (urlParts.length < 7) {
//             console.warn("Invalid GitHub file URL.");
//             return;
//         }

//         let owner = urlParts[3];
//         let repo = urlParts[4];
//         let branch = urlParts[6];
//         let filePath = urlParts.slice(7).join("/");

//         if (!filePath) {
//             console.warn("No file detected.");
//             return;
//         }

//         try {
//             let rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
//             let response = await fetch(rawUrl);
//             if (!response.ok) throw new Error(`Failed to fetch file content. Status: ${response.status}`);

//             let code = await response.text();
//             codeInput.value = code;
//         } catch (error) {
//             console.error("Error fetching GitHub code:", error.message);
//         }
//     }

//     await fetchGitHubCode();

//     // Toggle language selector based on action
//     actionSelect.addEventListener("change", () => {
//         if (actionSelect.value === "convert") {
//             languageSelector.style.display = "block";
//         } else {
//             languageSelector.style.display = "none";
//         }
//     });

//     runAction.addEventListener("click", async () => {
//         const selectedAction = actionSelect.value;
//         const code = codeInput.value.trim();
//         const targetLanguage = languageInput ? languageInput.value.trim() : "";

//         output.innerHTML = "";

//         if (!code) {
//             showError("Please paste or fetch code first.");
//             return;
//         }

//         if (selectedAction === "convert" && !targetLanguage) {
//             showError("Please select a target language.");
//             return;
//         }

//         console.log("Selected Target Language:", targetLanguage);
//         output.textContent = "Processing...";

//         try {
//             let result;

//             if (selectedAction === "explain") {
//                 if (typeof window.explainCode !== "function") {
//                     throw new Error("explainCode function is not loaded properly. Check if explainCode.js is included in popup.html.");
//                 }
//                 result = await window.explainCode(code);
//             } else if (selectedAction === "convert") {
//                 if (typeof window.convertCode !== "function") {
//                     throw new Error("convertCode function is not loaded properly.");
//                 }
//                 result = await window.convertCode(code, targetLanguage);
//             } else if (selectedAction === "highlight") {
//                 if (typeof window.highlightErrors !== "function") {
//                     throw new Error("highlightErrors function is not loaded properly.");
//                 }
//                 result = await window.highlightErrors(code);
//             } else {
//                 throw new Error("Invalid action selected");
//             }

//             showResult(result, selectedAction);
//         } catch (error) {
//             console.error("Error processing action:", error);
//             showError(error.message);
//         }
//     });

//     function showResult(result, action) {
//         if (action === "highlight") {
//             output.innerHTML = result.split("\n").map(line =>
//                 line.toLowerCase().includes("error") ? `<span class="error-highlight">${line}</span>` : line
//             ).join("<br>");
//         } else {
//             output.innerHTML = result;
//         }
//     }

//     function showError(message) {
//         output.textContent = message;
//         output.style.color = "#dc3545";
//     }

//     chrome.storage.sync.get("apiKey", function(data) {
//         if (!data.apiKey) {
//             const settingsLink = document.createElement("p");
//             settingsLink.innerHTML = '<a href="#" id="openOptions">⚙️ Set API Key</a>';
//             document.querySelector(".popup-container").appendChild(settingsLink);
//             document.getElementById("openOptions").addEventListener("click", () => chrome.runtime.openOptionsPage());
//         }
//     });
// });



document.addEventListener("DOMContentLoaded", async () => {
    const actionSelect = document.getElementById("actionSelect");
    const languageSelector = document.getElementById("languageSelector");
    const languageDropdown = document.getElementById("languageDropdown"); // Correct ID
    const codeInput = document.getElementById("codeInput");
    const runAction = document.getElementById("runAction");
    const output = document.getElementById("output");

    async function fetchGitHubCode() {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab || !tab.url.includes("github.com")) {
            console.warn("Not a GitHub file page.");
            return;
        }

        let urlParts = tab.url.split("/");
        if (urlParts.length < 7) {
            console.warn("Invalid GitHub file URL.");
            return;
        }

        let owner = urlParts[3];
        let repo = urlParts[4];
        let branch = urlParts[6];
        let filePath = urlParts.slice(7).join("/");

        if (!filePath) {
            console.warn("No file detected.");
            return;
        }

        try {
            let rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
            let response = await fetch(rawUrl);
            if (!response.ok) throw new Error(`Failed to fetch file content. Status: ${response.status}`);

            let code = await response.text();
            codeInput.value = code;
        } catch (error) {
            console.error("Error fetching GitHub code:", error.message);
        }
    }

    await fetchGitHubCode();

    // Toggle language selector based on action
    actionSelect.addEventListener("change", () => {
        if (actionSelect.value === "convert") {
            languageSelector.style.display = "block";
        } else {
            languageSelector.style.display = "none";
        }
    });

    runAction.addEventListener("click", async () => {
        const selectedAction = actionSelect.value;
        const code = codeInput.value.trim();
        const targetLanguage = languageDropdown.value.trim(); // Corrected selection

        output.innerHTML = "";

        if (!code) {
            showError("Please paste or fetch code first.");
            return;
        }

        if (selectedAction === "convert" && !targetLanguage) {
            showError("Please select a target language.");
            return;
        }

        console.log("Selected Target Language:", targetLanguage); // Debugging log
        output.textContent = "Processing...";

        try {
            let result;

            if (selectedAction === "explain") {
                if (typeof window.explainCode !== "function") {
                    throw new Error("explainCode function is not loaded properly. Check if explainCode.js is included in popup.html.");
                }
                result = await window.explainCode(code);
            } else if (selectedAction === "convert") {
                if (typeof window.convertCode !== "function") {
                    throw new Error("convertCode function is not loaded properly.");
                }
                result = await window.convertCode(code, targetLanguage);
            } else if (selectedAction === "highlight") {
                if (typeof window.highlightErrors !== "function") {
                    throw new Error("highlightErrors function is not loaded properly.");
                }
                result = await window.highlightErrors(code);
            } else {
                throw new Error("Invalid action selected");
            }

            showResult(result, selectedAction);
        } catch (error) {
            console.error("Error processing action:", error);
            showError(error.message);
        }
    });

    function showResult(result, action) {
        if (action === "highlight") {
            output.innerHTML = result.split("\n").map(line =>
                line.toLowerCase().includes("error") ? `<span class="error-highlight">${line}</span>` : line
            ).join("<br>");
        } else {
            output.innerHTML = result;
        }
    }

    function showError(message) {
        output.textContent = message;
        output.style.color = "#dc3545";
    }

    chrome.storage.sync.get("apiKey", function(data) {
        if (!data.apiKey) {
            const settingsLink = document.createElement("p");
            settingsLink.innerHTML = '<a href="#" id="openOptions">⚙️ Set API Key</a>';
            document.querySelector(".popup-container").appendChild(settingsLink);
            document.getElementById("openOptions").addEventListener("click", () => chrome.runtime.openOptionsPage());
        }
    });
});
