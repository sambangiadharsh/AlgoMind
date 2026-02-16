import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function DSAChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi 👋 Ask me anything about DSA or Competitive Programming!"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/dsa-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      const aiMessage = {
        role: "ai",
        text: data.reply
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Something went wrong 😢" }
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">


      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0  space-y-6">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`max-w-3xl px-6 py-4 rounded-2xl shadow-sm ${
        msg.role === "user"
          ? "bg-blue-600 text-white ml-auto"
          : "bg-white text-gray-800"
      }`}
    >
      {msg.role === "user" ? (
        <p className="whitespace-pre-wrap">{msg.text}</p>
      ) : (
        <div className="prose prose-sm max-w-none prose-headings:mb-2 prose-p:mb-2 prose-li:mb-1 prose-pre:bg-gray-900 prose-pre:text-white prose-code:text-blue-600">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {msg.text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  ))}

  {loading && (
    <div className="bg-white text-blue-700 px-6 py-4 rounded-2xl shadow-sm w-fit">
      Thinking...
    </div>
  )}

  <div ref={messagesEndRef} />
</div>


      {/* Input */}
      <div className="p-4 bg-white text-black flex gap-2 border-t">
        <input
          type="text"
          placeholder="Ask about DP, Graphs, Binary Search..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
