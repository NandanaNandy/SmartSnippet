chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggle") {
    // Implement the logic to explain code on the current page
    // For example, find code blocks and send them to the API for explanation
  }
});
