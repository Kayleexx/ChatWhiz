let chatHistory = [];

function saveChatHistory() {
  try {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

function loadChatHistory() {
  try {
    const chatHistoryData = localStorage.getItem('chatHistory');
    if (chatHistoryData) {
      chatHistory = JSON.parse(chatHistoryData);
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
}

function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();
  if (message !== '') {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageElement.appendChild(messageText);
    chatHistory.push(message);
    document.getElementById('chat-area').appendChild(messageElement);
    messageInput.value = '';

    processMessage(message);
  }
}

async function processMessage(message) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    const chatArea = document.getElementById('chat-area');

    const assistantMessageElement = document.createElement('div');
    assistantMessageElement.classList.add('message', 'bot');
    const assistantMessageText = document.createElement('p');
    assistantMessageText.textContent = aiResponse;
    assistantMessageElement.appendChild(assistantMessageText);
    chatArea.appendChild(assistantMessageElement);

    chatHistory.push(aiResponse);
  } catch (error) {
    console.error('Error processing message:', error);
    console.error(error.message);
    console.error(error.stack);
  }
}

window.onload = () => {
  loadChatHistory();

  const sendButton = document.getElementById('send-button');
  sendButton.addEventListener('click', sendMessage);
};
