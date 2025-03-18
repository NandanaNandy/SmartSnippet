// document.getElementById('explainButton').addEventListener('click', function() {
//   const code = document.getElementById('codeInput').value;
//   // Call the API to explain the code
//   fetch('https://api.example.com/explain', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ code: code })
//   })
//   .then(response => response.json())
//   .then(data => {
//     document.getElementById('explanation').innerText = data.explanation;
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
// });
document.addEventListener('DOMContentLoaded', function() {
    // Handle button click in the popup
    document.getElementById('explainButton').addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            // Send a message to the content script to trigger code extraction
            chrome.tabs.sendMessage(tabs[0].id, { action: "triggerExplain" });
        });
    });
});
