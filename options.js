document.getElementById('saveButton').addEventListener('click', function() {
  const apiKey = document.getElementById('apiKey').value;
  chrome.storage.sync.set({ apiKey: apiKey }, function() {
    alert('API Key saved');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get('apiKey', function(data) {
    document.getElementById('apiKey').value = data.apiKey || '';
  });
});
