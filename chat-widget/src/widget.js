// ============= chat-widget/src/widget.js =============
(function() {
  'use strict';

  const API_URL = 'http://localhost:5000/api';
  
  class ChatbotWidget {
    constructor(embedKey) {
      this.embedKey = embedKey;
      this.isOpen = false;
      this.sessionId = this.generateSessionId();
      this.settings = {
        botName: 'Support Bot',
        welcomeMessage: 'Hi! How can I help you today?',
        themeColor: '#3b82f6',
        position: 'right'
      };
      this.messages = [];
      this.init();
    }

    generateSessionId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async init() {
      await this.fetchSettings();
      this.injectStyles();
      this.createWidget();
      this.attachEventListeners();
    }

    async fetchSettings() {
      try {
        const response = await fetch(`${API_URL}/chat/settings/${this.embedKey}`);
        const data = await response.json();
        if (data && data.settings) {
          this.settings = { ...this.settings, ...data.settings };
        }
      } catch (error) {
        console.error('Failed to fetch chatbot settings:', error);
      }
    }

    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .chatbot-widget * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        .chatbot-widget {
          position: fixed;
          bottom: 20px;
          ${this.settings.position}: 20px;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .chatbot-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${this.settings.themeColor};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .chatbot-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        
        .chatbot-button svg {
          width: 28px;
          height: 28px;
          fill: white;
        }
        
        .chatbot-window {
          position: absolute;
          bottom: 80px;
          ${this.settings.position}: 0;
          width: 380px;
          height: 600px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .chatbot-window.open {
          display: flex;
        }
        
        .chatbot-header {
          background: ${this.settings.themeColor};
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .chatbot-header-title {
          font-weight: 600;
          font-size: 16px;
        }
        
        .chatbot-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        
        .chatbot-close:hover {
          opacity: 1;
        }
        
        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f9fafb;
        }
        
        .chatbot-message {
          margin-bottom: 12px;
          display: flex;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .chatbot-message.user {
          justify-content: flex-end;
        }
        
        .chatbot-message.bot {
          justify-content: flex-start;
        }
        
        .chatbot-message-content {
          max-width: 75%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .chatbot-message.user .chatbot-message-content {
          background: ${this.settings.themeColor};
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .chatbot-message.bot .chatbot-message-content {
          background: white;
          color: #374151;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .chatbot-typing {
          display: none;
          padding: 10px 14px;
          background: white;
          border-radius: 12px;
          max-width: 75px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .chatbot-typing.active {
          display: block;
        }
        
        .chatbot-typing-dots {
          display: flex;
          gap: 4px;
        }
        
        .chatbot-typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9ca3af;
          animation: typing 1.4s infinite;
        }
        
        .chatbot-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .chatbot-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
        
        .chatbot-input-area {
          padding: 16px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }
        
        .chatbot-input-form {
          display: flex;
          gap: 8px;
        }
        
        .chatbot-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .chatbot-input:focus {
          border-color: ${this.settings.themeColor};
        }
        
        .chatbot-send {
          padding: 10px 16px;
          background: ${this.settings.themeColor};
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: opacity 0.2s;
        }
        
        .chatbot-send:hover {
          opacity: 0.9;
        }
        
        .chatbot-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 100px);
            bottom: 10px;
            left: 20px !important;
            right: 20px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    createWidget() {
      const container = document.createElement('div');
      container.className = 'chatbot-widget';
      container.innerHTML = `
        <button class="chatbot-button" aria-label="Open chat">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div class="chatbot-window" role="dialog" aria-label="Chat window">
          <div class="chatbot-header">
            <div class="chatbot-header-title">${this.settings.botName}</div>
            <button class="chatbot-close" aria-label="Close chat">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
          
          <div class="chatbot-messages" id="chatbot-messages">
            <div class="chatbot-message bot">
              <div class="chatbot-message-content">
                ${this.settings.welcomeMessage}
              </div>
            </div>
            <div class="chatbot-typing">
              <div class="chatbot-typing-dots" aria-hidden="true">
                <div class="chatbot-typing-dot"></div>
                <div class="chatbot-typing-dot"></div>
                <div class="chatbot-typing-dot"></div>
              </div>
            </div>
          </div>
          
          <div class="chatbot-input-area">
            <form class="chatbot-input-form" id="chatbot-form" aria-label="Chat input form">
              <input 
                type="text" 
                class="chatbot-input" 
                id="chatbot-input"
                placeholder="Type your message..."
                autocomplete="off"
                aria-label="Message input"
              />
              <button type="submit" class="chatbot-send" aria-label="Send message">Send</button>
            </form>
          </div>
        </div>
      `;
      
      document.body.appendChild(container);
      this.container = container;
    }

    attachEventListeners() {
      const button = this.container.querySelector('.chatbot-button');
      const closeBtn = this.container.querySelector('.chatbot-close');
      const form = this.container.querySelector('#chatbot-form');

      // Safety checks: ensure elements exist before adding listeners
      if (!button || !closeBtn || !form) {
        console.error('Chatbot widget DOM not found — createWidget did not run correctly.', { button, closeBtn, form });
        return;
      }
      
      button.addEventListener('click', () => this.toggleWidget());
      closeBtn.addEventListener('click', () => this.toggleWidget());
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    toggleWidget() {
      this.isOpen = !this.isOpen;
      const windowEl = this.container.querySelector('.chatbot-window');
      
      if (this.isOpen) {
        windowEl.classList.add('open');
        this.container.querySelector('#chatbot-input').focus();
      } else {
        windowEl.classList.remove('open');
      }
    }

    async handleSubmit(e) {
      e.preventDefault();
      
      const input = this.container.querySelector('#chatbot-input');
      const message = input.value.trim();
      
      if (!message) return;
      
      this.addMessage(message, 'user');
      input.value = '';
      
      this.showTyping();
      
      try {
        const response = await fetch(`${API_URL}/chat/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            embedKey: this.embedKey,
            message: message,
            sessionId: this.sessionId
          })
        });
        
        const data = await response.json();
        
        setTimeout(() => {
          this.hideTyping();
          this.addMessage(data.response || 'Sorry, I could not process your request.', 'bot');
        }, 500);
        
      } catch (error) {
        console.error('Failed to send message:', error);
        this.hideTyping();
        this.addMessage('Sorry, something went wrong. Please try again.', 'bot');
      }
    }

    addMessage(text, sender) {
      const messagesContainer = this.container.querySelector('#chatbot-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = `chatbot-message ${sender}`;
      messageDiv.innerHTML = `
        <div class="chatbot-message-content">${this.escapeHtml(text)}</div>
      `;
      
      const typing = messagesContainer.querySelector('.chatbot-typing');
      messagesContainer.insertBefore(messageDiv, typing);
      
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
      const typing = this.container.querySelector('.chatbot-typing');
      typing.classList.add('active');
      
      const messagesContainer = this.container.querySelector('#chatbot-messages');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
      const typing = this.container.querySelector('.chatbot-typing');
      typing.classList.remove('active');
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Defensive: ensure window.ChatbotWidget is an object (not a string)
  if (typeof window.ChatbotWidget === 'string') {
    console.warn('Overwriting string window.ChatbotWidget with object to initialize widget');
    window.ChatbotWidget = {};
  } else {
    window.ChatbotWidget = window.ChatbotWidget || {};
  }

  window.ChatbotWidget.init = function(embedKey) {
    if (!embedKey) {
      console.error('Chatbot Widget: Embed key is required');
      return;
    }
    try {
      new ChatbotWidget(embedKey);
    } catch (err) {
      console.error('Failed to initialize ChatbotWidget:', err);
    }
  };

  // Auto-init if loader queues exist for either name
  try {
    if (window.chatbot && window.chatbot.q) {
      window.chatbot.q.forEach(function(args) {
        if (args[0] === 'init') {
          window.ChatbotWidget.init(args[1]);
        }
      });
    }
  } catch (err) {
    console.warn('Error checking window.chatbot queue:', err);
  }

  try {
    if (window.cb && window.cb.q) {
      window.cb.q.forEach(function(args) {
        if (args[0] === 'init') {
          window.ChatbotWidget.init(args[1]);
        }
      });
    }
  } catch (err) {
    console.warn('Error checking window.cb queue:', err);
  }

  // Provide safe loader functions. Only override if not a pre-existing string (to avoid clobbering)
  if (typeof window.chatbot !== 'string') {
    window.chatbot = function() {
      const args = Array.prototype.slice.call(arguments);
      if (args[0] === 'init') {
        window.ChatbotWidget.init(args[1]);
      } else {
        // queue other calls if needed
        window.chatbot.q = window.chatbot.q || [];
        window.chatbot.q.push(args);
      }
    };
  } else {
    console.warn('window.chatbot is a string; not overwriting to avoid conflicts.');
  }

  if (typeof window.cb !== 'string') {
    window.cb = function() {
      const args = Array.prototype.slice.call(arguments);
      if (args[0] === 'init') {
        window.ChatbotWidget.init(args[1]);
      } else {
        window.cb.q = window.cb.q || [];
        window.cb.q.push(args);
      }
    };
  } else {
    console.warn('window.cb is a string; not overwriting to avoid conflicts.');
  }

})();
