<<<<<<< HEAD
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
=======
document.getElementById("fetchCode").addEventListener("click", async () => {
    const repoUrl = document.getElementById("repoUrl").value;
    if (!repoUrl) return alert("Enter a valid GitHub repo URL!");

    const repoApiUrl = repoUrl.replace("https://github.com/", "https://api.github.com/repos/");
    try {
        let response = await fetch(`${repoApiUrl}/contents/`);
        let data = await response.json();

        let codeFiles = data.filter(file => file.name.endsWith(".py") || file.name.endsWith(".js"));
        let fileContents = [];

        for (let file of codeFiles) {
            let fileResponse = await fetch(file.download_url);
            let fileData = await fileResponse.text();
            fileContents.push({ filename: file.name, content: fileData });
        }

        document.getElementById("output").textContent = JSON.stringify(fileContents, null, 2);
        
        // Send to local Llama API
        let llamaResponse = await fetch("http://localhost:8000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ files: fileContents })
        });

        let llamaData = await llamaResponse.json();
        document.getElementById("output").textContent = JSON.stringify(llamaData, null, 2);

    } catch (error) {
        console.error("Error fetching GitHub data:", error);
    }
>>>>>>> 3a31fc3c326b82b905c6fe214379184f5000d52d
});
