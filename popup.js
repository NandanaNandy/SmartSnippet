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
});
