function getApiEndpoint() {
  // Dynamically get the base URL (protocol + hostname + port)
  const protocol = window.location.protocol;
  const host = window.location.host;

  // Construct the API endpoint URL based on the current environment
  const apiEndpoint = `API endpoint: ${protocol}//${host}/api/chat`;

  return apiEndpoint;
}

// Example usage in your frontend
const apiEndpoint = getApiEndpoint();
// document.getElementById("api-endpoint").innerText = apiEndpoint;

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");

  // Function to add a message to the chat
  function addMessage(sender, text) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.innerHTML = `<div class="text">${text}</div>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
  }
  addMessage("bot", apiEndpoint);
  // Function to handle sending a message
  function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    addMessage("user", text);
    userInput.value = ""; // Clear the input box

    // Send user input to Gemini API and get response
    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    })
      .then((response) => response.json())
      .then((data) => {
        addMessage("bot", data.response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Event listener for send button
  sendButton.addEventListener("click", sendMessage);

  // Event listener for pressing Enter key
  userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});
