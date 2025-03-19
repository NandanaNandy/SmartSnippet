import explainCode from "./explainCode.js";
import convertCode from "./convertCode.js";
import highlightErrors from "./highlightErrors.js";

document.addEventListener("DOMContentLoaded", () => {
    const actionSelect = document.getElementById("actionSelect");
    const languageSelector = document.getElementById("languageSelector");
    const codeInput = document.getElementById("codeInput");
    const runAction = document.getElementById("runAction");
    const output = document.getElementById("output");

    actionSelect.addEventListener("change", () => {
        languageSelector.style.display = 
            actionSelect.value === "convert" ? "block" : "none";
    });

    runAction.addEventListener("click", async () => {
        const selectedAction = actionSelect.value;
        const code = codeInput.value.trim();
        const targetLanguage = document.getElementById("languageInput").value;

        output.innerHTML = "";
        
        if (!code) {
            showError("Please paste your code.");
            return;
        }

        if (selectedAction === "convert" && !targetLanguage) {
            showError("Please select a target language.");
            return;
        }

        output.textContent = "Processing...";
        
        try {
            let result;
            switch(selectedAction) {
                case "explain":
                    result = await explainCode(code);
                    break;
                case "convert":
                    result = await convertCode(code, targetLanguage);
                    break;
                case "highlight":
                    result = await highlightErrors(code);
                    break;
                default:
                    throw new Error("Invalid action selected");
            }
            showResult(result, selectedAction);
        } catch (error) {
            showError(error.message);
        }
    });

    function showResult(result, action) {
        if (action === "highlight") {
            const lines = result.split("\n").map(line => {
                if (line.startsWith("Error:")) {
                    return `<span style="color: red;">${line}</span>`;
                }
                return line;
            });
            output.innerHTML = lines.join("<br>");
        } else {
            output.innerHTML = result;
        }
        output.style.color = "#202124";
    }

    function showError(message) {
        output.textContent = message;
        output.style.color = "#dc3545";
    }
});