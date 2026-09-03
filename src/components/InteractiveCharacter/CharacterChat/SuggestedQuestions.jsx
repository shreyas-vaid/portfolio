export default function SuggestedQuestions({ onSelectQuestion, disabled = false }) {
  const suggestions = [
    { label: "🎵 MUSIC", query: "What kind of music does Shreyas like?" },
    { label: "🍜 FOOD", query: "What food does Shreyas enjoy?" },
    { label: "🎮 HOBBIES", query: "What does Shreyas do outside coding?" },
    { label: "🧠 PERSONALITY", query: "What is Shreyas's personality like?" },
    { label: "💼 INTERNSHIP", query: "Tell me about Shreyas's Data Analyst internship at ThinkNEXT" },
    { label: "💻 TECH", query: "What technologies does Shreyas specialize in?" },
    { label: "📜 CERTS", query: "What certifications does he hold?" },
    { label: "🚀 GOALS", query: "What are his career and development goals?" }
  ];

  return (
    <div className="chat-suggestions-container" aria-label="Suggested Prompts">
      <div className="chat-suggestions-label">ASK ME ABOUT:</div>
      <div className="chat-suggestions-scroll">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className="chat-suggestion-chip"
            onClick={() => onSelectQuestion(item.query)}
            disabled={disabled}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
