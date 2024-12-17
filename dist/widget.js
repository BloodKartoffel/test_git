// src/index.js
(() => {
  const createChatWidget = () => {
    const chatContainer = document.createElement("div");
    chatContainer.innerHTML = `
          <div class="chat-container">
            <button id="chat-widget-expand-button" class="chat-expand-button" aria-label="\u0420\u043E\u0437\u0433\u043E\u0440\u043D\u0443\u0442\u0438 \u0447\u0430\u0442">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <div id="chat-widget-window" class="chat-window collapsed" role="dialog" aria-hidden="true">
              <button id="chat-widget-close-button" class="chat-close-button" aria-label="\u0417\u0433\u043E\u0440\u043D\u0443\u0442\u0438 \u0447\u0430\u0442">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 18l-6-6 6-6"></path>
                </svg>
              </button>
              <main id="chat-widget-content" class="chat-content" role="log" aria-live="polite">
                <div class="flex flex-col items-center justify-center text-center pb-4">
                  <p class="text-sm text-gray-300 font-light max-w-[80%] pt-4">\u041F\u0440\u043E\u0434\u043E\u0432\u0436\u0443\u044E\u0447\u0438 \u0434\u0456\u0430\u043B\u043E\u0433, \u0432\u0438 \u043F\u043E\u0433\u043E\u0434\u0436\u0443\u0454\u0442\u0435\u0441\u044C \u0437 <a class="font-normal underline" href="#">\u043F\u043E\u043B\u0456\u0442\u0438\u043A\u043E\u044E \u043E\u0431\u0440\u043E\u0431\u043A\u0438 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u0438\u0445 \u0434\u0430\u043D\u0438\u0445</a></p>
                </div>
              </main>
              <footer class="chat-footer">
                <input 
                  placeholder="\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F" 
                  id="chat-widget-input"
                  class="chat-input"
                  aria-label="\u041F\u043E\u043B\u0435 \u0432\u0432\u043E\u0434\u0443 \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F"
                  type="text"/>
                <button id="chat-widget-send-button" class="chat-send-button" aria-label="\u0412\u0456\u0434\u043F\u0440\u0430\u0432\u0438\u0442\u0438 \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9677 9.76342L25.4678 15.0105C27.1081 15.8302 27.1081 18.1696 25.4678 18.9893L14.9677 24.2364C13.1002 25.1696 11.0908 23.2505 11.9388 21.3436L13.4687 17.9032C13.4982 17.8369 13.5243 17.7694 13.547 17.7011H17.3485C17.7358 17.7011 18.0497 17.3872 18.0497 16.9999C18.0497 16.6126 17.7358 16.2987 17.3485 16.2987L13.547 16.2987C13.5243 16.2304 13.4982 16.1629 13.4687 16.0965L11.9388 12.6562C11.0908 10.7493 13.1002 8.8302 14.9677 9.76342ZM7.30078 15.13C7.30078 14.7428 7.61472 14.4288 8.00199 14.4288H9.87188C10.2592 14.4288 10.5731 14.7428 10.5731 15.13C10.5731 15.5173 10.2592 15.8313 9.87188 15.8313H8.00199C7.61472 15.8313 7.30078 15.5173 7.30078 15.13ZM8.00199 18.1686C7.61472 18.1686 7.30078 18.4826 7.30078 18.8698C7.30078 19.2571 7.61472 19.5711 8.00199 19.5711H9.87188C10.2592 19.5711 10.5731 19.2571 10.5731 18.8698C10.5731 18.4826 10.2592 18.1686 9.87188 18.1686H8.00199Z" fill="white"></path>
                  </svg>
                </button>
              </footer>
            </div>
          </div>
        `;
    document.body.appendChild(chatContainer);
    const chatWindow = chatContainer.querySelector("#chat-widget-window");
    const closeButton = chatContainer.querySelector("#chat-widget-close-button");
    const chatContent = chatContainer.querySelector("#chat-widget-content");
    const textInput = chatContainer.querySelector("#chat-widget-input");
    const sendButton = chatContainer.querySelector("#chat-widget-send-button");
    const expandButton = chatContainer.querySelector("#chat-widget-expand-button");
    let userName = "";
    let userColor = "";
    const socket = new WebSocket("ws://localhost:3030");
    socket.addEventListener("open", () => {
      console.log("\u041F\u0456\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u0434\u043E WebSocket \u0441\u0435\u0440\u0432\u0435\u0440\u0443");
    });
    socket.addEventListener("message", (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        console.error("\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0440\u043E\u0437\u043F\u0430\u0440\u0441\u0438\u0442\u0438 \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F:", error);
        return;
      }
      if (data.type === "init") {
        userName = data.name;
        userColor = data.color;
        console.log(`\u0412\u0438 \u043F\u0456\u0434\u043A\u043B\u044E\u0447\u0438\u043B\u0438\u0441\u044F \u044F\u043A ${userName} \u0437 \u043A\u043E\u043B\u044C\u043E\u0440\u043E\u043C ${userColor}`);
        addNotification("\u0412\u0438 \u0442\u0435\u043F\u0435\u0440 \u0443 \u0447\u0430\u0442\u0456");
      } else if (data.type === "notification") {
        addNotification(data.message);
      } else if (data.type === "message") {
        addMessage(data.name, data.color, data.message, "received");
      }
    });
    socket.addEventListener("close", () => {
      console.log("\u0412\u0456\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u0432\u0456\u0434 WebSocket \u0441\u0435\u0440\u0432\u0435\u0440\u0443");
      addNotification("\u0412\u0456\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u0432\u0456\u0434 \u0441\u0435\u0440\u0432\u0435\u0440\u0443");
    });
    socket.addEventListener("error", (error) => {
      console.error("WebSocket \u043F\u043E\u043C\u0438\u043B\u043A\u0430:", error);
      addNotification("\u0421\u0442\u0430\u043B\u0430\u0441\u044F \u043F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437 \u043F\u0456\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043D\u044F\u043C \u0434\u043E \u0441\u0435\u0440\u0432\u0435\u0440\u0443");
    });
    const applyCollapsedStyles = () => {
      chatWindow.style.background = "transparent";
      chatWindow.style.boxShadow = "none";
      chatWindow.style.border = "none";
    };
    const applyExpandedStyles = () => {
      chatWindow.style.background = "#ffffff";
      chatWindow.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)";
      chatWindow.style.border = "1px solid #e5e7eb";
    };
    const expandChat = () => {
      chatWindow.classList.remove("collapsed");
      chatWindow.classList.add("expanded");
      applyExpandedStyles();
      closeButton.style.display = "flex";
      expandButton.style.display = "none";
      textInput.focus();
    };
    const collapseChat = () => {
      chatWindow.classList.remove("expanded");
      chatWindow.classList.add("collapsed");
      applyCollapsedStyles();
      closeButton.style.display = "none";
      expandButton.style.display = "flex";
    };
    const addMessage = (name, color, message, type = "received") => {
      const messageBubble = document.createElement("div");
      const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (type === "sent") {
        messageBubble.className = `flex justify-end items-start space-x-2 opacity-0`;
        messageBubble.style.animation = "chat-widget-fade-in 0.3s ease forwards";
        messageBubble.innerHTML = `
                    <div class="sent-message-container bg-[#0060ff] text-white py-2 px-4 rounded-2xl shadow relative">
                      <span class="message-text">${message}</span>
                      <span class="timestamp text-xs text-blue-200">${timestamp}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" fill="none" style="position: absolute; right: -3px; bottom: 0px;">
                        <path fill="#0060ff" d="M6 0v8.111c0 1.242.267 2.478.824 3.587.875 1.741 2.14 3.876 3.704 4.246.905.056 1.227.056.472.056q-.24-.001-.472-.056C7.838 15.778 0 15.12 0 12.5 0 9.7 4.167 1.667 6 0"></path>
                      </svg>
                    </div>
                `;
      } else if (type === "received") {
        const avatarLetter = name.charAt(0).toUpperCase();
        messageBubble.className = `flex justify-start items-start space-x-2 opacity-0`;
        messageBubble.style.animation = "chat-widget-fade-in 0.3s ease forwards";
        messageBubble.innerHTML = `
                    <div class="chat-avatar" style="background-color: ${color}; color: #fff;">${avatarLetter}</div>
                    <div class="received-message-container flex flex-col">
                      <span class="chat-sender-name" style="color: ${color};">${name}</span>
                      <div class="received-message-content bg-gray-200 text-gray-700 py-2 px-4 rounded-2xl shadow relative">
                        <span class="message-text">${message}</span>
                        <span class="timestamp text-xs text-gray-400">${timestamp}</span>
                      </div>
                    </div>
                `;
      }
      chatContent.appendChild(messageBubble);
      chatContent.scrollTop = chatContent.scrollHeight;
    };
    const addNotification = (message) => {
      const notification = document.createElement("div");
      notification.className = `flex justify-center items-center opacity-0 my-2`;
      notification.style.animation = "chat-widget-fade-in 0.3s ease forwards";
      notification.innerHTML = `
                <div class="message-text text-gray-600">
                  ${message}
                </div>
            `;
      chatContent.appendChild(notification);
      chatContent.scrollTop = chatContent.scrollHeight;
    };
    const prepareMessage = () => {
      const userMessage = textInput.value.trim();
      if (!userMessage || socket.readyState !== WebSocket.OPEN) return;
      expandChat();
      addMessage(userName, userColor, userMessage, "sent");
      textInput.value = "";
      const messageData = {
        type: "message",
        message: userMessage
      };
      socket.send(JSON.stringify(messageData));
    };
    closeButton.addEventListener("click", () => {
      collapseChat();
    });
    textInput.addEventListener("input", () => {
      textInput.scrollLeft = textInput.scrollWidth;
    });
    sendButton.addEventListener("click", () => prepareMessage());
    textInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        prepareMessage();
      }
    });
    expandButton.addEventListener("click", () => {
      if (chatWindow.classList.contains("collapsed")) {
        expandChat();
      } else {
        collapseChat();
      }
    });
    collapseChat();
  };
  window.ChatWidget = { init: createChatWidget };
})();
