import { useState } from "react";
import AIChatModal from "./AIChatModal";

export default function FloatingAIButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          🤖
        </div>
      </div>

      {/* Chat Modal */}
      {open && <AIChatModal onClose={() => setOpen(false)} />}
    </>
  );
}
