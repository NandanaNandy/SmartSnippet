// UI Elements
const codeExplainUrl = chrome.runtime.getURL('icons/icon2.png');
function addCodeExplainButton() {
    const existingButton = document.querySelector('.AppHeader-button.AppHeader-search-whenNarrow');
    if (existingButton && !document.getElementById('codeExplainButton')) {
        const button = document.createElement('button');
        button.id = 'codeExplainButton';
        button.innerHTML = `<img src="${codeExplainUrl}" alt="Code Explain" style="width: 20px; height: 20px;">`;
        Object.assign(button.style, {
            padding: '8px',
            background: 'white',
            border: '1px solid #f6f8fa',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
        });
        existingButton.parentNode.insertBefore(button, existingButton);
        button.addEventListener('click', openCodeExplain);
    }
}


// Main Popup Logic
function openCodeExplain() {
    if (document.getElementById('codeExplainPopup')) return;

    chrome.storage.local.get(['apiKey'], (result) => {
        const apiKey = result.apiKey;
        if (!apiKey) {
            alert('⚠️ Please configure your Groq API key first!');
            return;
        }

        const popup = createPopup();
        setupPopupLogic(popup, apiKey);
    });
}

function createPopup() {
    const popup = document.createElement('div');
    popup.id = 'codeExplainPopup';
    popup.innerHTML = `
        <div class="popup-container">
            <div class="popup-header">Code Assistant 🔍</div>
            <div class="popup-content">
                <div class="action-selector">
                    <label for="actionSelect" class="action-label">Select Action:</label>
                    <select id="actionSelect" class="action-dropdown">
                        <option value="explain">Explain Code</option>
                        <option value="convert">Convert Code</option>
                        <option value="highlight">Find Errors</option>
                    </select>
                    <div id="languageSection" style="display:none;">
                        <label for="targetLanguage" class="language-label">Target Language:</label>
                        <input id="targetLanguage" placeholder="Target language..." list="languages" class="language-input">
                        <datalist id="languages">
                            ${['Python', 'JavaScript', 'Java', 'C++', 'Ruby', 'Go']
                              .map(l => `<option>${l}</option>`).join('')}
                        </datalist>
                    </div>
                </div>
                <textarea id="codeInput" placeholder="Paste your code here..." class="code-textarea"></textarea>
                <button id="analyzeButton" class="analyze-button">Analyze</button>
                <div class="output-container">
                    <pre id="aiOutput" class="output-display"></pre>
                </div>
                <button id="closePopup" class="close-button">Close</button>
            </div>
        </div>
    `;

    addPopupStyles();
    document.body.appendChild(popup);
    makeDraggable(popup);
    return popup;
}

function setupPopupLogic(popup, apiKey) {
    const actionSelect = popup.querySelector('#actionSelect');
    const languageSection = popup.querySelector('#languageSection');
    const analyzeButton = popup.querySelector('#analyzeButton');
    const outputElement = popup.querySelector('#aiOutput');

    actionSelect.addEventListener('change', () => {
        languageSection.style.display = actionSelect.value === 'convert' ? 'block' : 'none';
    });

    analyzeButton.addEventListener('click', async () => {
        const code = popup.querySelector('#codeInput').value.trim();
        const action = actionSelect.value;
        const targetLang = popup.querySelector('#targetLanguage').value;

        if (!code) {
            outputElement.textContent = 'Please enter some code to analyze!';
            return;
        }

        try {
            outputElement.innerHTML = '<em>Analyzing code...</em>';
            const prompt = createPrompt(action, code, targetLang);
            const result = await callGroqAPI(apiKey, prompt);
            outputElement.innerHTML = formatOutput(action, result);
        } catch (error) {
            outputElement.innerHTML = `<span class="error-highlight">Error: ${error.message}</span>`;
        }
    });

    popup.querySelector('#closePopup').addEventListener('click', () => popup.remove());
}

// Groq API Integration
async function callGroqAPI(apiKey, prompt) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 1000
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

function createPrompt(action, code, targetLang) {
    const prompts = {
        explain: `Analyze this code and provide a detailed explanation:\n\n${code}\n\nFormat your response with:\n1. Purpose\n2. Key functions\n3. Data flow\n4. Notable patterns`,
        convert: `Convert this code to ${targetLang} following best practices:\n\n${code}\n\nInclude comments explaining key changes`,
        highlight: `Identify potential errors in this code:\n\n${code}\n\nFormat response as:\nLINE [X]: [ISSUE_TYPE]\n- Description\n- Suggested fix`
    };
    return prompts[action];
}

function formatOutput(action, result) {
    if (action === 'highlight') {
        if (result.toLowerCase().includes('no error')) {
            return '<span class="success-message">✅ No critical issues found</span>';
        }
        return result.replace(/LINE \d+:.+/g, match => 
            `<span class="error-highlight">${match}</span>`
        );
    }
    return result.replace(/\n/g, '<br>');
}

// Style Management
function addPopupStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #codeExplainPopup {
            position: fixed;
            top: 50px;
            right: 20px;
            background: #ffffff;
            border: 1px solid #ccc;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            width: 420px;
            font-family: Arial, sans-serif;
        }
        .popup-header {
            padding: 15px;
            background: #007BFF;
            color: white;
            font-size: 16px;
            font-weight: bold;
            border-radius: 10px 10px 0 0;
            cursor: move;
        }
        .popup-content {
            padding: 20px;
        }
        .action-label, .language-label {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
            display: block;
        }
        .action-dropdown, .language-input {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
        }
        #codeInput {
            width: 100%;
            height: 150px;
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
            resize: vertical;
        }
        .analyze-button, .close-button {
            padding: 10px 20px;
            background: #007BFF;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
        }
        .analyze-button:hover, .close-button:hover {
            background: #0056b3;
        }
        .output-container {
            margin-top: 15px;
        }
        .output-display {
            white-space: pre-wrap;
            background: #f8f9fa;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 6px;
            max-height: 300px;
            overflow-y: auto;
            font-size: 14px;
        }
        .error-highlight {
            color: #dc3545;
            background: #ffecec;
            padding: 2px 4px;
            border-radius: 4px;
        }
        .success-message {
            color: #28a745;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}

// Draggable Functionality
function makeDraggable(element) {
    const header = element.querySelector('.popup-header');
    header.style.userSelect = 'none';
    
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDrag;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = `${element.offsetTop - pos2}px`;
        element.style.left = `${element.offsetLeft - pos1}px`;
    }

    function closeDrag() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Observer Setup
new MutationObserver(() => addCodeExplainButton())
    .observe(document.body, { childList: true, subtree: true });

addCodeExplainButton();