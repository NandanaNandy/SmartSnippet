document.getElementById('explainButton').addEventListener('click', function() {
  const code = document.getElementById('codeInput').value;
  // Call the API to explain the code
  fetch('https://api.example.com/explain', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code: code })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('explanation').innerText = data.explanation;
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
