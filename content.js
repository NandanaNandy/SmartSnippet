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
        applyGitHubTheme(); // Apply theme after popup creation
    });
}

function createPopup() {
    const popup = document.createElement('div');
    popup.id = 'codeExplainPopup';
    popup.innerHTML = `
        <div class="popup-container">
            <div class="popup-header">
                Code Assistant 🔍
                <button id="closePopup" class="close-button">✖</button>
            </div>
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
        explain: `You are the world's best coding tutor. Analyze the given code and provide a detailed explanation.
                    ### Key Aspects to Cover:
                    1. **Purpose** – Explain what the code does in simple terms.
                    2. **Key Functions** – Highlight important functions, methods, and logic used.
                    3. **Data Flow** – Describe how data moves through the code.
                    4. **Notable Patterns** – Identify any significant coding patterns, optimizations, or best practices.

                    Provide clear explanations with examples if needed. Only analyze programming code—if no valid code is provided, respond with:
                    'I am a code tutor, I can only explain programming codes.'

                    ### Input Code:
                    \\\`\${code}
                    \\\`
                    
                    ### Explanation:
                    `
                ,
        convert: `You are the world's biggest code conversion expert. Convert the provided code to \${targetLang} while maintaining best practices.

                    ### Key Requirements:
                    - Ensure that the converted \${targetLang} code follows **best practices**.
                    - *Import all necessary libraries* required for \${targetLang}.
                    - The syntax must be *100% correct* with no type errors.
                    - Use *appropriate data structures and methods* equivalent to the original language.
                    - Add meaningful *comments* explaining key changes in the converted code.
                    - The conversion should be *executable without modifications*.

                    ### Input Code:
                    \\\`\${sourceLang}
                    \${code}
                    \\\`

                    ### Output Code in \${targetLang}:
                    \\\`\${targetLang}
                    `
                ,
        highlight: `You are the world's biggest Software Developer, an expert in identifying and fixing code issues. 

                    ### Task:
                    Analyze the provided code for:
                    - **Syntax errors**  
                    - **Potential bugs**  
                    - **Code smells (bad practices, inefficiencies, or redundancies)**  

                    ### Format your response as:
                    **LINE [X]: [ISSUE_TYPE]**  
                    - **Description** of the issue  
                    - **Suggested fix**  

                    ### Additional Instructions:
                    - Explain issues in an easy-to-understand way.
                    - If no errors are found, simply respond with:  
                    **'Given Code is Correct, Keep Going!!!!'**

                    ### Input Code:
                    \`\`\`${code}\`\`\`

                    ### Analysis:
                    `
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
            position: relative;
        }
        .popup-header #closePopup {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            margin-bottom: 5px;
        }
        .popup-header #closePopup:hover {
            color: #ffcccc;
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
            // padding: 15px ;
            padding-top: 5px;
            padding-left: 15px;
            padding-bottom: 20px;
            padding-right: 15px;
            background: #007BFF;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
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

// Theme Handling
function applyGitHubTheme() {
    const theme = document.documentElement.getAttribute('data-color-mode');
    const colorMode = document.documentElement.getAttribute('data-light-theme') || document.documentElement.getAttribute('data-dark-theme');

    const themeColors = {
        'light': {
            background: '#ffffff',
            border: '#d0d7de',
            text: '#1f2328',
            header: '#f6f8fa',
            button: '#007BFF',
            buttonHover: '#0056b3'
        },
        'dark': {
            background: '#0d1117',
            border: '#30363d',
            text: '#c9d1d9',
            header: '#161b22',
            button: '#238636',
            buttonHover: '#2ea043'
        },
        'dark_high_contrast': {
            background: '#000000',
            border: '#f0f6fc',
            text: '#f0f6fc',
            header: '#1f6feb',
            button: '#f9826c',
            buttonHover: '#ff7b72'
        },
        'dark_dimmed': {
            background: '#161b22',
            border: '#30363d',
            text: '#adbac7',
            header: '#21262d',
            button: '#238636',
            buttonHover: '#2ea043'
        }
    };

    const selectedTheme = theme === 'dark' ? (colorMode || 'dark') : 'light';
    const colors = themeColors[selectedTheme] || themeColors['light'];

    const popup = document.getElementById('codeExplainPopup');
    if (popup) {
        popup.style.background = colors.background;
        popup.style.borderColor = colors.border;
        popup.style.color = colors.text;
        popup.querySelector('.popup-header').style.background = colors.header;
        const buttons = popup.querySelectorAll('.analyze-button, .close-button');
        buttons.forEach(btn => {
            btn.style.background = colors.button;
            btn.addEventListener('mouseover', () => btn.style.background = colors.buttonHover);
            btn.addEventListener('mouseout', () => btn.style.background = colors.button);
        });
    }
}

// Observer Setup
new MutationObserver(() => addCodeExplainButton())
    .observe(document.body, { childList: true, subtree: true });

addCodeExplainButton();