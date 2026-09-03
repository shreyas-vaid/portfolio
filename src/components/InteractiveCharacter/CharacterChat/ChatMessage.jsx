export default function ChatMessage({ message }) {
  const isBot = message.sender === "bot";

  // Simple formatter for bold text and bullet points
  const formatContent = (text) => {
    return text.split("\n").map((line, i) => {
      // Bold syntax **text**
      const formattedLine = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="color: var(--accent-red-bright); font-weight: 700;">$1</strong>'
      );

      return (
        <span
          key={i}
          style={{ display: "block", marginBottom: line.trim() === "" ? "6px" : "2px" }}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  return (
    <div className={`chat-message-row ${isBot ? "bot-row" : "user-row"}`}>
      <div className={`chat-message-bubble ${isBot ? "bot-bubble" : "user-bubble"}`}>
        <div className="chat-message-meta">
          <span className="chat-sender-tag">
            {isBot ? "SV-01 // AI" : "VISITOR // USER"}
          </span>
          <span className="chat-timestamp">{message.timestamp}</span>
        </div>
        <div className="chat-message-body">{formatContent(message.text)}</div>
      </div>
    </div>
  );
}
