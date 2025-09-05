import { useState } from "react";
import { Button } from "@/components/ui/button";

function getReply(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("credit") || s.includes("कार्बन") || s.includes("क्रेडिट"))
    return "कार्बन क्रेडिट खेती के माध्यम से CO₂ घटाने पर मिलता है। अपने खेत की परियोजना जोड़ें और अनुमान देखें।";
  if (s.includes("income") || s.includes("आय") || s.includes("कमाई"))
    return "अनुमानित आय क्रेडिट × ₹800 प्रति क्रेडिट के आधार पर दिखाई जाती है।";
  if (s.includes("help") || s.includes("मदद"))
    return "हमारी हेल्पलाइन 1800-270-2222 पर कॉल करें।";
  return "धन्यवाद! अधिक जानकारी के लिए परियोजना जोड़ें या हेल्पलाइन पर कॉल करें।";
}

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "नमस्ते! मैं सहायता के लिए तैयार हूँ। अपने प्रश���न लिखें।" },
  ]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    const reply = getReply(q);
    setMessages((m) => [...m, { role: "user", text: q }, { role: "bot", text: reply }]);
    setInput("");
  };

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4 max-w-2xl">
      <div className="space-y-2 max-h-64 overflow-auto pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`text-sm ${m.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block rounded-lg px-3 py-2 ${m.role === "user" ? "bg-emerald-100" : "bg-white border"}`}>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input className="flex-1 h-10 border rounded-md px-3" value={input} onChange={(e) => setInput(e.target.value)} placeholder="अपना प्रश्न लिखें..." />
        <Button onClick={send} className="bg-gradient-to-r from-green-600 to-emerald-600">Send</Button>
      </div>
    </div>
  );
}
