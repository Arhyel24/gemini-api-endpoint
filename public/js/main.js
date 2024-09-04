function getApiEndpoint() {
  // Dynamically get the base URL (protocol + hostname + port)
  const protocol = window.location.protocol;
  const host = window.location.host;

  // Construct the API endpoint URL based on the current environment
  const apiEndpoint = `<p>We are thrilled to present <strong>Duet AI</strong>, an innovative project developed by Poke, James, and Enoch. Duet AI is built to revolutionize conversational experiences with its advanced artificial intelligence capabilities.</p>
  <p>Explore the capabilities of Duet AI by interacting with our API endpoint:
  <a href="${protocol}//${host}/api/chat" target="_blank">${protocol}//${host}/api/chat</a></p>`;

  return apiEndpoint;
}

const checkMarks = (content) => {
  // Regular expression to check for common Markdown symbols
  const markdownSymbolsRegex =
    /(\*\*|\*|__|_|`|~|\[\[|\]\]|\!\[|\]\(|\]\)|\!\[|\]\()/;

  // Check if the content contains any Markdown symbols
  if (markdownSymbolsRegex.test(content)) {
    // If Markdown is detected, use marked to convert Markdown to HTML

    return marked.parse(content);
  } else {
    // If no Markdown is detected, return content as is
    return content;
  }
};

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

    if (sender === "user") {
      // Outgoing message (user)
      messageElement.classList.add("outgoing_msg");
      messageElement.innerHTML = `
      <div class="sent_msg">
        <p>${text}</p>
        <span class="time_date">${getCurrentTime()} | Today</span>
      </div>
    `;
    } else if (sender === "bot") {
      // Incoming message (bot)
      messageElement.classList.add("incoming_msg");
      console.log(checkMarks(text));
      messageElement.innerHTML = `
      <div class="incoming_msg_img">
        <img src="https://ptetutorials.com/images/user-profile.png" alt="bot">
      </div>
      <div class="received_msg">
      <i>Duet AI</i>
        <div class="received_withd_msg">
          <p>${checkMarks(text)}</p>
          
        </div>
        <span class="time_date">${getCurrentTime()} | Today</span>
      </div>
    `;
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
  }

  // Function to get the current time in HH:MM AM/PM format
  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  // // Function to add a message to the chat
  // function addMessage(sender, text) {
  //   const messageElement = document.createElement("div");
  //   messageElement.classList.add("message", sender);
  //   messageElement.innerHTML = `<div class="text">${text}</div>`;
  //   chatBox.appendChild(messageElement);
  //   chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
  // }
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
