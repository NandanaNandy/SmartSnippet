// // Check if the current page is a GitHub code file
// function isGitHubCodeFile() {
//     return window.location.pathname.includes("/blob/");
// }

// // Extract code from GitHub code viewer
// function extractCode() {
//     let codeLines = document.querySelectorAll('.blob-code');
//     if (codeLines.length === 0) {
//         // Fallback to try other selectors if GitHub changes their DOM
//         codeLines = document.querySelectorAll('table[data-tagsearch-lang] .js-file-line');
//     }
//     return Array.from(codeLines).map(line => line.innerText).join('\n');
// }

// // Inject the "Explain Code" button inside GitHub's toolbar
// function addExplainCodeIcon() {
//     if (document.getElementById("explain-code-icon")) return; // Prevent duplicates

//     // Try multiple selectors to find the toolbar - GitHub changes their UI often
//     let toolbar = document.querySelector(".file-actions") || 
//                   document.querySelector(".repository-content .d-flex") ||
//                   document.querySelector(".Box-header");
                  
//     if (!toolbar) return;

//     let button = document.createElement("button");
//     button.id = "explain-code-icon";
//     button.innerText = "💡 Explain";
//     button.style.padding = "5px 10px";
//     button.style.marginLeft = "10px";
//     button.style.border = "none";
//     button.style.background = "#28a745"; // GitHub green
//     button.style.color = "white";
//     button.style.fontSize = "14px";
//     button.style.cursor = "pointer";
//     button.style.borderRadius = "4px";

//     button.onclick = () => {
//         toggleSidebar();
//         let extractedCode = extractCode();
//         if (!extractedCode.trim()) {
//             document.getElementById("explanation-content").innerHTML = "<p style='color:red;'>⚠ No code found.</p>";
//             return;
//         }
//         document.getElementById("explanation-content").innerHTML = "<p>⏳ Fetching explanation...</p>";
//         chrome.runtime.sendMessage({ action: "explainCode", code: extractedCode });
//     };

//     toolbar.appendChild(button);
// }

// // Create or toggle sidebar for displaying explanation
// function toggleSidebar() {
//     let sidebar = document.getElementById("code-explainer-sidebar");
    
//     if (sidebar) {
//         sidebar.style.display = sidebar.style.display === "none" ? "flex" : "none";
//         return;
//     }
    
//     // Create sidebar if it doesn't exist
//     sidebar = document.createElement("div");
//     sidebar.id = "code-explainer-sidebar";
//     sidebar.style = "position: fixed; top: 50px; right: 0; width: 400px; height: 80vh; background-color: #f8f9fa; border-left: 2px solid #ccc; box-shadow: -2px 0 10px rgba(0,0,0,0.1); padding: 15px; z-index: 10000; font-family: Arial, sans-serif; display: flex; flex-direction: column;";

//     let header = document.createElement("div");
//     header.style = "display: flex; justify-content: space-between; align-items: center;";
    
//     let title = document.createElement("h3");
//     title.innerText = "Code Explanation";
//     title.style.color = "#333";
//     title.style.margin = "0";
    
//     let closeButton = document.createElement("button");
//     closeButton.innerText = "×";
//     closeButton.style = "background: none; border: none; font-size: 24px; cursor: pointer;";
//     closeButton.onclick = function() {
//         sidebar.style.display = "none";
//     };
    
//     header.appendChild(title);
//     header.appendChild(closeButton);

//     let explanationContainer = document.createElement("div");
//     explanationContainer.id = "explanation-content";
//     explanationContainer.style = "margin-top: 10px; overflow-y: auto; flex-grow: 1; white-space: pre-wrap;";
//     explanationContainer.innerHTML = "Click 'Explain' to generate explanation.";

//     sidebar.appendChild(header);
//     sidebar.appendChild(explanationContainer);
//     document.body.appendChild(sidebar);
// }

// // Listen for explanation response from background.js
// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// //     if (request.action === "displayExplanation") {
// //         let explanationContainer = document.getElementById("explanation-content");
// //         if (explanationContainer) {
// //             explanationContainer.innerHTML = request.explanation ? 
// //                 `<div style="white-space: pre-wrap;">${request.explanation}</div>` : 
// //                 "<p style='color:red;'>⚠ No explanation available.</p>";
// //         }
// //     } else if (request.action === "toggle") {
// //         toggleSidebar();
// //     }
// // });

// // Listen for explanation response from background.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "displayExplanation") {
//         let explanationContainer = document.getElementById("explanation-content");
//         if (explanationContainer) {
//             explanationContainer.innerHTML = request.explanation ? 
//                 `<pre style="white-space: pre-wrap; background-color: #222; color: #fff; padding: 10px; border-radius: 5px;">
//                     <code>${request.explanation.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
//                  </pre>` 
//                 : "<p style='color:red;'>⚠ No explanation available.</p>";
//         }
//     } else if (request.action === "toggle") {
//         toggleSidebar();
//     }
// });

// // Observer for GitHub's SPA navigation to detect when we navigate to a code file
// const observer = new MutationObserver(function(mutations) {
//     if (isGitHubCodeFile()) {
//         setTimeout(addExplainCodeIcon, 1000); // Delay to ensure GitHub's UI is fully loaded
//     }
// });

// // Start observing for GitHub's SPA navigation
// observer.observe(document.body, { childList: true, subtree: true });

// // Initial check when the content script loads
// if (isGitHubCodeFile()) {
//     addExplainCodeIcon();
// }

// function extractCode() {
//     let codeBlocks = document.querySelectorAll('table.js-file-line-container td.blob-code');
//     if (codeBlocks.length === 0) {
//         codeBlocks = document.querySelectorAll('.blob-code-inner');
//     }
//     if (codeBlocks.length === 0) {
//         console.error("No code found in GitHub file.");
//         return "";
//     }
//     return Array.from(codeBlocks).map(line => line.innerText).join('\n');
// }

















// // Check if the current page is a GitHub code file
// function isGitHubCodeFile() {
//     return window.location.pathname.includes("/blob/");
// }

// // Extract code from GitHub code viewer
// function extractCode() {
//     let codeLines = document.querySelectorAll('.blob-code');
//     if (codeLines.length === 0) {
//         // Fallback to try other selectors if GitHub changes their DOM
//         codeLines = document.querySelectorAll('table[data-tagsearch-lang] .js-file-line');
//     }
//     return Array.from(codeLines).map(line => line.innerText).join('\n');
// }

// // Inject the "Explain Code" button inside GitHub's toolbar
// function addExplainCodeIcon() {
//     if (document.getElementById("explain-code-icon")) return; // Prevent duplicates

//     // Try multiple selectors to find the toolbar - GitHub changes their UI often
//     let toolbar = document.querySelector(".file-actions") || 
//                   document.querySelector(".repository-content .d-flex") ||
//                   document.querySelector(".Box-header");
                  
//     if (!toolbar) return;

//     let button = document.createElement("button");
//     button.id = "explain-code-icon";
//     button.innerText = "💡 Explain";
//     button.style.padding = "5px 10px";
//     button.style.marginLeft = "10px";
//     button.style.border = "none";
//     button.style.background = "#28a745"; // GitHub green
//     button.style.color = "white";
//     button.style.fontSize = "14px";
//     button.style.cursor = "pointer";
//     button.style.borderRadius = "4px";

//     button.onclick = () => {
//         toggleSidebar();
//         let extractedCode = extractCode();
//         if (!extractedCode.trim()) {
//             document.getElementById("explanation-content").innerHTML = "<p style='color:red;'>⚠ No code found.</p>";
//             return;
//         }
//         document.getElementById("explanation-content").innerHTML = "<p>⏳ Fetching explanation...</p>";
//         chrome.runtime.sendMessage({ action: "explainCode", code: extractedCode });
//     };

//     toolbar.appendChild(button);
// }

// // Create or toggle sidebar for displaying explanation
// function toggleSidebar() {
//     let sidebar = document.getElementById("code-explainer-sidebar");
    
//     if (sidebar) {
//         sidebar.style.display = sidebar.style.display === "none" ? "flex" : "none";
//         return;
//     }
    
//     // Create sidebar if it doesn't exist
//     sidebar = document.createElement("div");
//     sidebar.id = "code-explainer-sidebar";
//     sidebar.style = "position: fixed; top: 50px; right: 0; width: 400px; height: 80vh; background-color: #f8f9fa; border-left: 2px solid #ccc; box-shadow: -2px 0 10px rgba(0,0,0,0.1); padding: 15px; z-index: 10000; font-family: Arial, sans-serif; display: flex; flex-direction: column;";

//     let header = document.createElement("div");
//     header.style = "display: flex; justify-content: space-between; align-items: center;";
    
//     let title = document.createElement("h3");
//     title.innerText = "Code Explanation";
//     title.style.color = "#333";
//     title.style.margin = "0";
    
//     let closeButton = document.createElement("button");
//     closeButton.innerText = "×";
//     closeButton.style = "background: none; border: none; font-size: 24px; cursor: pointer;";
//     closeButton.onclick = function() {
//         sidebar.style.display = "none";
//     };
    
//     header.appendChild(title);
//     header.appendChild(closeButton);

//     let explanationContainer = document.createElement("div");
//     explanationContainer.id = "explanation-content";
//     explanationContainer.style = "margin-top: 10px; overflow-y: auto; flex-grow: 1; white-space: pre-wrap;";
//     explanationContainer.innerHTML = "Click 'Explain' to generate explanation.";

//     sidebar.appendChild(header);
//     sidebar.appendChild(explanationContainer);
//     document.body.appendChild(sidebar);
// }

// // Function to add "Code Explain" button in GitHub Header
// function addCodeExplainButton() {
//     const headerRight = document.querySelector('.AppHeader-actions');

//     if (headerRight && !document.getElementById('codeExplainButton')) {
//         const button = document.createElement('button');
//         button.id = 'codeExplainButton';
//         button.innerHTML = "🔍 Code Explain";

//         Object.assign(button.style, {
//             padding: '8px',
//             background: 'white',
//             border: '1px solid #f6f8fa',
//             borderRadius: '6px',
//             cursor: 'pointer',
//             marginRight: '10px'
//         });

//         // Insert the button into the GitHub header
//         headerRight.insertBefore(button, headerRight.firstChild);

//         // Add click event to send extracted code for explanation
//         button.addEventListener('click', () => {
//             let extractedCode = extractCode();
//             if (!extractedCode.trim()) {
//                 alert("⚠ No code found.");
//                 return;
//             }
//             chrome.runtime.sendMessage({ action: "explainCode", code: extractedCode });
//         });
//     }
// }

// // Listen for explanation response from background.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "displayExplanation") {
//         let explanationContainer = document.getElementById("explanation-content");
//         if (explanationContainer) {
//             explanationContainer.innerHTML = request.explanation ? 
//                 `<pre style="white-space: pre-wrap; background-color: #222; color: #fff; padding: 10px; border-radius: 5px;">
//                     <code>${request.explanation.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
//                  </pre>` 
//                 : "<p style='color:red;'>⚠ No explanation available.</p>";
//         }
//     } else if (request.action === "toggle") {
//         toggleSidebar();
//     }
// });

// // Observer for GitHub's SPA navigation to detect when we navigate to a code file
// const observer = new MutationObserver(function(mutations) {
//     if (isGitHubCodeFile()) {
//         setTimeout(addExplainCodeIcon, 1000); // Delay to ensure GitHub's UI is fully loaded
//     }
//     addCodeExplainButton();
// });

// // Start observing for GitHub's SPA navigation
// observer.observe(document.body, { childList: true, subtree: true });

// // Initial check when the content script loads
// if (isGitHubCodeFile()) {
//     addExplainCodeIcon();
// }
// addCodeExplainButton();

// function extractCode() {
//     let codeBlocks = document.querySelectorAll('table.js-file-line-container td.blob-code');
//     if (codeBlocks.length === 0) {
//         codeBlocks = document.querySelectorAll('.blob-code-inner');
//     }
//     if (codeBlocks.length === 0) {
//         console.error("No code found in GitHub file.");
//         return "";
//     }
//     return Array.from(codeBlocks).map(line => line.innerText).join('\n');
// }
















// const codeExplainUrl = chrome.runtime.getURL('icons/icon2.jpg');

// function addCodeExplainButton() {
//     console.log("Trying to add button...");

//     const existingButton = document.querySelector('.AppHeader-button.AppHeader-search-whenNarrow');

//     if (!existingButton) {
//         console.log("Target button not found! Make sure the selector is correct.");
//         return;
//     }

//     if (document.getElementById('codeExplainButton')) {
//         console.log("Button already exists.");
//         return;
//     }

//     const button = document.createElement('button');
//     button.id = 'codeExplainButton';
//     button.innerHTML = `<img src="${codeExplainUrl}" alt="Code Explain" style="width: 16px; height: 16px;">`;

//     Object.assign(button.style, {
//         padding: '4px',
//         background: 'red',
//         border: '1px solid #f6f8fa',
//         borderRadius: '4px',
//         cursor: 'pointer',
//         marginRight: '8px'
//     });

//     existingButton.parentNode.insertBefore(button, existingButton);
//     console.log("Button added successfully!");
// }

// new MutationObserver(() => {
//     console.log("DOM changed, trying to insert button...");
//     addCodeExplainButton();
// }).observe(document.body, { childList: true, subtree: true });

// addCodeExplainButton();

// async function highlightErrors(code) {
//     try {
//         const data = await new Promise((resolve) => {
//             chrome.storage.sync.get("apiKey", (result) => resolve(result));
//         });

//         const apiKey = data.apiKey;
//         if (!apiKey) {
//             throw new Error("API key not set. Please set your API key in the extension options.");
//         }

//         const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
//         const messages = [{
//             role: "system",
//             content: "You are the world's biggest Software Developer. You know each and everything about coding. Analyze the code for syntax errors, potential bugs, and code smells. List errors with line numbers and suggestions for fixes. Try to communicate in an easier way of understanding. If there are no errors in the code, tell 'Given Code is Correct, Keep Going!!!!'"
//         }, {
//             role: "user",
//             content: `Find errors in this code:\n\n${code}`
//         }];

//         const response = await fetch(API_ENDPOINT, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${apiKey}`
//             },
//             body: JSON.stringify({
//                 model: "llama3-8b-8192",
//                 messages: messages,
//                 temperature: 0.1
//             })
//         });

//         if (!response.ok) {
//             throw new Error(`API Error: ${response.status} ${response.statusText}`);
//         }

//         const responseData = await response.json();
//         if (!responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
//             throw new Error("Invalid API response format");
//         }

//         return responseData.choices[0].message.content;
//     } catch (error) {
//         console.error("Error detection failed:", error);
//         return `Error highlighting failed: ${error.message}`;
//     }
// }

// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = highlightErrors;
// } else {
//     window.highlightErrors = highlightErrors;
// }


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "toggleSidebar") {
//         toggleSidebar();
//     }
// });











const codeExplainUrl = chrome.runtime.getURL('icons/icon2.jpg');

// Function to check if the current page is a GitHub code file
function isGitHubCodeFile() {
    return window.location.pathname.includes("/blob/");
}

// Function to extract code from the GitHub code viewer
function extractCode() {
    let codeBlocks = document.querySelectorAll('td.blob-code');
    if (codeBlocks.length === 0) {
        codeBlocks = document.querySelectorAll('table.highlight pre, table.js-file-line-container td');
    }

    let extractedCode = Array.from(codeBlocks).map(line => line.innerText.trim()).join('\n');

    console.log("Extracted Code:", extractedCode); // Debugging Output

    return extractedCode;
}

// Function to add the "Explain Code" button to GitHub
function addCodeExplainButton() {
    console.log("Trying to add button...");

    // Select GitHub's action toolbar where buttons like "Raw", "Blame", and "History" exist
    const toolbar = document.querySelector('.d-flex.gap-2'); // Update selector if needed

    if (!toolbar) {
        console.log("Toolbar not found! Check the selector.");
        return;
    }

    if (document.getElementById('codeExplainButton')) {
        console.log("Button already exists.");
        return;
    }

    // const button = document.createElement('button');
    // button.id = 'codeExplainButton';
    // button.innerHTML = `<img src="${codeExplainUrl}" alt="Explain Code" style="width: 16px; height: 16px;"> Explain Code`;

    // Object.assign(button.style, {
    //     padding: '6px 10px',
    //     background: '#2ea44f',
    //     color: 'white',
    //     border: '1px solid #f6f8fa',
    //     borderRadius: '6px',
    //     cursor: 'pointer',
    //     fontSize: '14px',
    //     fontWeight: 'bold',
    //     display: 'flex',
    //     alignItems: 'center',
    //     gap: '5px'
    // });

    button.addEventListener('click', () => {
        let extractedCode = extractCode();
        if (!extractedCode.trim()) {
            alert("⚠ No code found.");
            return;
        }
        chrome.runtime.sendMessage({ action: "explainCode", code: extractedCode });
    });

    toolbar.appendChild(button);
    console.log("Button added successfully!");
}

// Observe page changes (SPA navigation) and insert the button if needed
new MutationObserver(() => {
    if (isGitHubCodeFile()) {
        addCodeExplainButton();
    }
}).observe(document.body, { childList: true, subtree: true });

// Initial check when the content script loads
if (isGitHubCodeFile()) {
    addCodeExplainButton();
}
