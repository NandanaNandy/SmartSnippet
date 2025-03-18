// // function isGitHubCodeFile() {
// //     return window.location.pathname.includes("/blob/");
// // }
// // // 
// // // Function to extract code from GitHub
// // function extractCode() {
// //     let codeLines = document.querySelectorAll('.blob-code');
// //     return Array.from(codeLines).map(line => line.innerText).join('\n');
// // }

// // // Function to create a floating button
// // function createExplainButton() {
// //     if (document.getElementById("explain-button")) return;

// //     let button = document.createElement("button");
// //     button.id = "explain-button";
// //     button.innerText = "💡 Explain Code";
// //     button.style.position = "fixed";
// //     button.style.bottom = "20px";
// //     button.style.right = "20px";
// //     button.style.background = "#007bff";
// //     button.style.color = "white";
// //     button.style.border = "none";
// //     button.style.padding = "10px 15px";
// //     button.style.borderRadius = "5px";
// //     button.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.3)";
// //     button.style.cursor = "pointer";
// //     button.style.zIndex = "10000";

// //     button.onclick = () => {
// //         createSidebar();
// //         let extractedCode = extractCode();
// //         document.getElementById("explanation-content").innerHTML = "<p>⏳ Fetching explanation...</p>";
// //         chrome.runtime.sendMessage({ action: "explainCode", code: extractedCode });
// //     };

// //     document.body.appendChild(button);
// // }

// // // Function to create the sidebar
// // function createSidebar() {
// //     if (document.getElementById("code-explainer-sidebar")) return;

// //     let sidebar = document.createElement("div");
// //     sidebar.id = "code-explainer-sidebar";
// //     sidebar.style = "position: fixed; top: 50px; right: 0; width: 400px; height: 80vh; background-color: #f8f9fa; border-left: 2px solid #ccc; box-shadow: -2px 0 10px rgba(0,0,0,0.1); padding: 15px; z-index: 10000; font-family: Arial, sans-serif; display: flex; flex-direction: column;";

// //     let title = document.createElement("h3");
// //     title.innerText = "Code Explanation";
// //     title.style.color = "#333";

// //     let explanationContainer = document.createElement("div");
// //     explanationContainer.id = "explanation-content";
// //     explanationContainer.style.whiteSpace = "pre-wrap";
// //     explanationContainer.innerHTML = "Click 'Explain Code' to generate explanation.";

// //     sidebar.appendChild(title);
// //     sidebar.appendChild(explanationContainer);
// //     document.body.appendChild(sidebar);
// // }

// // // Listen for API response
// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// //     if (request.action === "displayExplanation") {
// //         let explanationContainer = document.getElementById("explanation-content");
// //         if (explanationContainer) {
// //             explanationContainer.innerHTML = request.explanation ? `<p>${request.explanation}</p>` : "<p style='color:red;'>⚠ No explanation available.</p>";
// //         }
// //     }
// // });

// // // Inject UI elements when viewing a GitHub code file
// // if (isGitHubCodeFile()) {
// //     createExplainButton();
// // }
// // Check if the current page is a GitHub code file
// function isGitHubCodeFile() {
//     return window.location.pathname.includes("/blob/");
// }

// // Extract the raw code from GitHub file view
// function extractCode() {
//     let codeLines = document.querySelectorAll('.blob-code');
//     return Array.from(codeLines).map(line => line.innerText).join('\n');
// }

// // Function to create a floating "Explain Code" button
// function createExplainButton() {
//     if (document.getElementById("explain-button")) return;

//     let button = document.createElement("button");
//     button.id = "explain-button";
//     button.innerText = "💡 Explain Code";
//     button.style.position = "fixed";
//     button.style.bottom = "20px";
//     button.style.right = "20px";
//     button.style.background = "#007bff";
//     button.style.color = "white";
//     button.style.border = "none";
//     button.style.padding = "10px 15px";
//     button.style.borderRadius = "5px";
//     button.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.3)";
//     button.style.cursor = "pointer";
//     button.style.zIndex = "10000";

//     button.onclick = () => {
//         createSidebar();
//         let extractedCode = extractCode();
//         if (!extractedCode.trim()) {
//             document.getElementById("explanation-content").innerHTML = "<p style='color:red;'>⚠ No code found on this page.</p>";
//             return;
//         }
//         document.getElementById("explanation-content").innerHTML = "<p>⏳ Fetching explanation...</p>";
//         chrome.runtime.sendMessage({ action: "explainCode", code: extractedCode });
//     };

//     document.body.appendChild(button);
// }

// // Function to create a sidebar for displaying explanations
// function createSidebar() {
//     if (document.getElementById("code-explainer-sidebar")) return;

//     let sidebar = document.createElement("div");
//     sidebar.id = "code-explainer-sidebar";
//     sidebar.style = "position: fixed; top: 50px; right: 0; width: 400px; height: 80vh; background-color: #f8f9fa; border-left: 2px solid #ccc; box-shadow: -2px 0 10px rgba(0,0,0,0.1); padding: 15px; z-index: 10000; font-family: Arial, sans-serif; display: flex; flex-direction: column;";

//     let title = document.createElement("h3");
//     title.innerText = "Code Explanation";
//     title.style.color = "#333";

//     let explanationContainer = document.createElement("div");
//     explanationContainer.id = "explanation-content";
//     explanationContainer.style.whiteSpace = "pre-wrap";
//     explanationContainer.innerHTML = "Click 'Explain Code' to generate explanation.";

//     sidebar.appendChild(title);
//     sidebar.appendChild(explanationContainer);
//     document.body.appendChild(sidebar);
// }

// // Listen for AI explanation response from background.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "displayExplanation") {
//         let explanationContainer = document.getElementById("explanation-content");
//         if (explanationContainer) {
//             explanationContainer.innerHTML = request.explanation ? `<p>${request.explanation}</p>` : "<p style='color:red;'>⚠ No explanation available.</p>";
//         }
//     }
// });

// // Inject UI elements automatically when on GitHub code file
// if (isGitHubCodeFile()) {
//     createExplainButton();
// }


function isGitHubCodeFile() {
    return window.location.pathname.includes("/blob/");
}

// Extract code from GitHub code viewer
function extractCode() {
    let codeLines = document.querySelectorAll('.blob-code');
    return Array.from(codeLines).map(line => line.innerText).join('\n');
}

// Inject the "Explain Code" button inside GitHub's toolbar
function addExplainCodeIcon() {
    if (document.getElementById("explain-code-icon")) return; // Prevent duplicates

    let toolbar = document.querySelector(".file-actions"); // GitHub's toolbar inside code files
    if (!toolbar) return;

    let button = document.createElement("button");
    button.id = "explain-code-icon";
    button.innerText = "💡 Explain";
    button.style.padding = "5px 10px";
    button.style.marginLeft = "10px";
    button.style.border = "none";
    button.style.background = "#28a745"; // GitHub green
    button.style.color = "white";
    button.style.fontSize = "14px";
    button.style.cursor = "pointer";
    button.style.borderRadius = "4px";

    button.onclick = () => {
        createSidebar();
        let extractedCode = extractCode();
        if (!extractedCode.trim()) {
            document.getElementById("explanation-content").innerHTML = "<p style='color:red;'>⚠ No code found.</p>";
            return;
        }
        document.getElementById("explanation-content").innerHTML = "<p>⏳ Fetching explanation...</p>";
        chrome.runtime.sendMessage({ action: "explainCode", code: extractedCode });
    };

    toolbar.appendChild(button);
}

// Create sidebar for displaying explanation
function createSidebar() {
    if (document.getElementById("code-explainer-sidebar")) return;

    let sidebar = document.createElement("div");
    sidebar.id = "code-explainer-sidebar";
    sidebar.style = "position: fixed; top: 50px; right: 0; width: 400px; height: 80vh; background-color: #f8f9fa; border-left: 2px solid #ccc; box-shadow: -2px 0 10px rgba(0,0,0,0.1); padding: 15px; z-index: 10000; font-family: Arial, sans-serif; display: flex; flex-direction: column;";

    let title = document.createElement("h3");
    title.innerText = "Code Explanation";
    title.style.color = "#333";

    let explanationContainer = document.createElement("div");
    explanationContainer.id = "explanation-content";
    explanationContainer.style.whiteSpace = "pre-wrap";
    explanationContainer.innerHTML = "Click 'Explain' to generate explanation.";

    sidebar.appendChild(title);
    sidebar.appendChild(explanationContainer);
    document.body.appendChild(sidebar);
}

// Listen for explanation response from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "displayExplanation") {
        let explanationContainer = document.getElementById("explanation-content");
        if (explanationContainer) {
            explanationContainer.innerHTML = request.explanation ? `<p>${request.explanation}</p>` : "<p style='color:red;'>⚠ No explanation available.</p>";
        }
    }
});

// Inject the icon inside GitHub's toolbar when on a code file
if (isGitHubCodeFile()) {
    addExplainCodeIcon();
}
