let selectedImage = null;

document.getElementById("imageInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedImage = e.target.result.split(',')[1];
        };
        reader.readAsDataURL(file);
    }
});

function sendMessage() {
    const userInput = document.getElementById("userInput");
    const text = userInput.value.trim();

    if (!text) return;

    // Display user message
    const chatbox = document.getElementById("chatbox");
    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = text;
    chatbox.appendChild(userMsg);
    userInput.value = "";

    // Send to backend
    const payload = {
        text: text,
        image: selectedImage
    };

    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        const botMsg = document.createElement("div");
        botMsg.className = "message bot";
        botMsg.textContent = data.reply;
        chatbox.appendChild(botMsg);
        chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch(error => {
        const errorMsg = document.createElement("div");
        errorMsg.className = "message bot";
        errorMsg.textContent = "Error: " + error.message;
        chatbox.appendChild(errorMsg);
    });
}

document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});