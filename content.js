// Check if the current page is a GitHub code file
function isGitHubCodeFile() {
    return window.location.pathname.includes("/blob/");
}

// Extract code from GitHub code viewer
function extractCode() {
    let codeLines = document.querySelectorAll('.blob-code');
    if (codeLines.length === 0) {
        // Fallback to try other selectors if GitHub changes their DOM
        codeLines = document.querySelectorAll('table[data-tagsearch-lang] .js-file-line');
    }
    return Array.from(codeLines).map(line => line.innerText).join('\n');
}

// Inject the "Explain Code" button inside GitHub's toolbar
function addExplainCodeIcon() {
    if (document.getElementById("explain-code-icon")) return; // Prevent duplicates

    // Try multiple selectors to find the toolbar - GitHub changes their UI often
    let toolbar = document.querySelector(".file-actions") || 
                  document.querySelector(".repository-content .d-flex") ||
                  document.querySelector(".Box-header");
                  
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
        toggleSidebar();
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

// Create or toggle sidebar for displaying explanation
function toggleSidebar() {
    let sidebar = document.getElementById("code-explainer-sidebar");
    
    if (sidebar) {
        sidebar.style.display = sidebar.style.display === "none" ? "flex" : "none";
        return;
    }
    
    // Create sidebar if it doesn't exist
    sidebar = document.createElement("div");
    sidebar.id = "code-explainer-sidebar";
    sidebar.style = "position: fixed; top: 50px; right: 0; width: 400px; height: 80vh; background-color: #f8f9fa; border-left: 2px solid #ccc; box-shadow: -2px 0 10px rgba(0,0,0,0.1); padding: 15px; z-index: 10000; font-family: Arial, sans-serif; display: flex; flex-direction: column;";

    let header = document.createElement("div");
    header.style = "display: flex; justify-content: space-between; align-items: center;";
    
    let title = document.createElement("h3");
    title.innerText = "Code Explanation";
    title.style.color = "#333";
    title.style.margin = "0";
    
    let closeButton = document.createElement("button");
    closeButton.innerText = "×";
    closeButton.style = "background: none; border: none; font-size: 24px; cursor: pointer;";
    closeButton.onclick = function() {
        sidebar.style.display = "none";
    };
    
    header.appendChild(title);
    header.appendChild(closeButton);

    let explanationContainer = document.createElement("div");
    explanationContainer.id = "explanation-content";
    explanationContainer.style = "margin-top: 10px; overflow-y: auto; flex-grow: 1; white-space: pre-wrap;";
    explanationContainer.innerHTML = "Click 'Explain' to generate explanation.";

    sidebar.appendChild(header);
    sidebar.appendChild(explanationContainer);
    document.body.appendChild(sidebar);
}

// Listen for explanation response from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "displayExplanation") {
        let explanationContainer = document.getElementById("explanation-content");
        if (explanationContainer) {
            explanationContainer.innerHTML = request.explanation ? 
                `<div style="white-space: pre-wrap;">${request.explanation}</div>` : 
                "<p style='color:red;'>⚠ No explanation available.</p>";
        }
    } else if (request.action === "toggle") {
        toggleSidebar();
    }
});

// Observer for GitHub's SPA navigation to detect when we navigate to a code file
const observer = new MutationObserver(function(mutations) {
    if (isGitHubCodeFile()) {
        setTimeout(addExplainCodeIcon, 1000); // Delay to ensure GitHub's UI is fully loaded
    }
});

// Start observing for GitHub's SPA navigation
observer.observe(document.body, { childList: true, subtree: true });

// Initial check when the content script loads
if (isGitHubCodeFile()) {
    addExplainCodeIcon();
}

function extractCode() {
    let codeBlocks = document.querySelectorAll('table.js-file-line-container td.blob-code');
    if (codeBlocks.length === 0) {
        codeBlocks = document.querySelectorAll('.blob-code-inner');
    }
    if (codeBlocks.length === 0) {
        console.error("No code found in GitHub file.");
        return "";
    }
    return Array.from(codeBlocks).map(line => line.innerText).join('\n');
}
