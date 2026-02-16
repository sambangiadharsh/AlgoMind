import DSAChatbot from "./DSAChatbot";

export default function AIChatModal({ onClose }) {
  return (
    <div className="fixed bottom-20 right-6 z-50 w-[420px] h-[80vh] max-h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border">

      {/* Modal Header */}
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center flex-shrink-0">
        <span className="font-semibold">AI Coach</span>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 min-h-0">
        <DSAChatbot />
      </div>
    </div>
  );
}

