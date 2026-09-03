import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import SuggestedQuestions from "./SuggestedQuestions";
import { INITIAL_BOT_MESSAGE, processQuery } from "./chatEngine";
import "./chat.css";

export default function CharacterChat({ isOpen, onClose, onSetCharacterPose }) {
  const [messages, setMessages] = useState([INITIAL_BOT_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input on desktop
      if (window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [isOpen, messages]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isThinking) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: userTime
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);
    if (onSetCharacterPose) onSetCharacterPose("THINKING");

    // Realistic brief typing/retrieval delay (400–600ms)
    setTimeout(() => {
      const response = processQuery(text);
      const botMsg = {
        id: `bot-${Date.now()}`,
        ...response
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
      if (onSetCharacterPose) onSetCharacterPose(response.pose || "FRONT");
    }, 550);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chibi-chat-window" role="dialog" aria-label="SV-01 Companion Chat">
      {/* Header */}
      <div className="chibi-chat-header">
        <div className="chat-header-title-wrap">
          <span className="chat-header-led" />
          <span className="chat-header-title">SV-01</span>
          <span className="chat-header-sub">// SHREYAS COMPANION</span>
        </div>
        <button
          type="button"
          className="chat-close-btn"
          onClick={onClose}
          aria-label="Close Companion Chat"
        >
          ✕ CLOSE
        </button>
      </div>

      {/* Message History */}
      <div className="chibi-chat-messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isThinking && (
          <div className="chat-thinking-row">
            <span className="chat-header-led" style={{ background: "var(--accent-red-bright)" }} />
            <span>SV-01 ACCESSING ARCHIVE...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <SuggestedQuestions onSelectQuestion={handleSendMessage} disabled={isThinking} />

      {/* Input Bar */}
      <div className="chibi-chat-input-bar">
        <input
          ref={inputRef}
          type="text"
          className="chat-input-field"
          placeholder="Ask anything about Shreyas... [ENTER]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isThinking}
        />
        <button
          type="button"
          className="chat-send-btn"
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isThinking}
        >
          ➤ SEND
        </button>
      </div>
    </div>
  );
}
