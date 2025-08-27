document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  // Helper to add a message to the chat box
  function addMessage(role, text, messageId = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${role}`;
    if (messageId) msgDiv.id = messageId;
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
  }

  // Helper to update a message's text by id
  function updateMessage(messageId, newText) {
    const msgDiv = document.getElementById(messageId);
    if (msgDiv) {
      msgDiv.textContent = newText;
    }
  }

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage('user', message);

    // Add temporary bot message
    const thinkingId = 'thinking-message-' + Date.now();
    addMessage('bot', 'Thinking...', thinkingId);

    // Prepare payload
    const payload = {
      messages: [
        { role: 'user', content: message }
      ]
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      const aiReply = data && typeof data.result === 'string' && data.result.trim()
        ? data.result
        : 'Sorry, no response received.';

      updateMessage(thinkingId, aiReply);
    } catch (err) {
      updateMessage(thinkingId, 'Failed to get response from server.');
    } finally {
      userInput.value = '';
      userInput.focus();
    }
  });
});