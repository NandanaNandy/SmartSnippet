function isGitHubCodeFile() {
    return window.location.pathname.includes("/blob/");
}

// Function to extract code from GitHub
function extractCode() {
    let codeLines = document.querySelectorAll('.blob-code');
    return Array.from(codeLines).map(line => line.innerText).join('\n');
}

// Function to create a floating "Explain Code" button
function createExplainButton() {
    if (document.getElementById("explain-button")) return; // Prevent duplicates

    let button = document.createElement("button");
    button.id = "explain-button";
    button.innerText = "💡 Explain Code";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.background = "#007bff";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "10px 15px";
    button.style.borderRadius = "5px";
    button.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.3)";
    button.style.cursor = "pointer";
    button.style.zIndex = "10000";

    button.onclick = () => {
        createSidebar();
        let extractedCode = extractCode();
        document.getElementById("explanation-content").innerText = "⏳ Fetching explanation...";
        chrome.runtime.sendMessage({ action: "explainCode", code: extractedCode });
    };

    document.body.appendChild(button);
}

// Function to create a collapsible sidebar
function createSidebar() {
    let existingSidebar = document.getElementById("code-explainer-sidebar");
    if (existingSidebar) return; // Prevent duplicates

    let sidebar = document.createElement("div");
    sidebar.id = "code-explainer-sidebar";
    sidebar.style.position = "fixed";
    sidebar.style.top = "50px";
    sidebar.style.right = "0";
    sidebar.style.width = "400px";
    sidebar.style.height = "80vh";
    sidebar.style.backgroundColor = "#f8f9fa";
    sidebar.style.borderLeft = "2px solid #ccc";
    sidebar.style.boxShadow = "-2px 0 10px rgba(0,0,0,0.1)";
    sidebar.style.overflowY = "auto";
    sidebar.style.padding = "15px";
    sidebar.style.zIndex = "10000";
    sidebar.style.fontFamily = "Arial, sans-serif";
    sidebar.style.display = "flex";
    sidebar.style.flexDirection = "column";
    sidebar.style.transition = "transform 0.3s ease-in-out";

    let isCollapsed = false;

    // Collapse Button
    let collapseButton = document.createElement("button");
    collapseButton.innerText = "◀";
    collapseButton.style.position = "absolute";
    collapseButton.style.left = "-30px";
    collapseButton.style.top = "10px";
    collapseButton.style.border = "none";
    collapseButton.style.background = "#007bff";
    collapseButton.style.color = "white";
    collapseButton.style.padding = "5px";
    collapseButton.style.cursor = "pointer";

    collapseButton.onclick = () => {
        isCollapsed = !isCollapsed;
        sidebar.style.transform = isCollapsed ? "translateX(100%)" : "translateX(0)";
        collapseButton.innerText = isCollapsed ? "▶" : "◀";
    };

    // Title
    let title = document.createElement("h3");
    title.innerText = "Code Explanation";
    title.style.marginTop = "0";
    title.style.color = "#333";

    // Explanation Content
    let explanationContainer = document.createElement("div");
    explanationContainer.id = "explanation-content";
    explanationContainer.style.whiteSpace = "pre-wrap";
    explanationContainer.innerText = "Click 'Explain Code' to generate explanation.";

    sidebar.appendChild(collapseButton);
    sidebar.appendChild(title);
    sidebar.appendChild(explanationContainer);
    document.body.appendChild(sidebar);
}

// Listen for explanation from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "displayExplanation") {
        let explanationContainer = document.getElementById("explanation-content");
        if (explanationContainer) {
            explanationContainer.innerText = request.explanation || "⚠ No explanation available.";
        }
    }
});

// Listen for `toggle` action (from background.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle") {
        let button = document.getElementById("explain-button");
        if (button) {
            button.style.display = button.style.display === "none" ? "block" : "none";
        }
    }
});

// Inject UI elements when viewing a GitHub code file
if (isGitHubCodeFile()) {
    createExplainButton();
}
