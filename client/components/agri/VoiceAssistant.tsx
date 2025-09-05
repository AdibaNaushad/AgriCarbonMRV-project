import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./Language";
import { Mic } from "lucide-react";
import { useT } from "./i18n";

function synthesize(text: string, lang: string) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function getReplyHindi(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("income") || s.includes("आय") || s.includes("कमाई"))
    return "आपके खेत से कार्बन क्रेडिट के माध्यम से अतिरिक्त आय संभव है। परियोजना जोड़ें और अनुमान देखें।";
  if (s.includes("पानी") || s.includes("water"))
    return "धान और मिश्रित खेती में पानी की बचत के बेहतर अवसर हैं। स्मार्ट सिंचाई अपनाएँ।";
  if (s.includes("कार्बन") || s.includes("credit"))
    return "कार्बन क्रेडिट अनुमान के लिए परियोजना जोड़ें। सिस्टम स्वतः CO₂ कैप्चर और क्रेडिट दिखाएगा।";
  if (s.includes("मदद") || s.includes("help"))
    return "हेल्पलाइन 1800-270-2222 पर कॉल करें या सपोर्ट पेज देखें।";
  return "मैं आपकी सहायता के लिए तैयार हूँ। परियोजना जोड़ें, और मैं चरण-दर-चरण मदद करूँगा।";
}

export default function VoiceAssistant() {
  const { lang } = useLanguage();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const recRef = useRef<any>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    // cleanup previous instance if any
    try { recRef.current?.abort?.(); } catch {}
    if (SR) {
      const rec = new SR();
      rec.continuous = false;
      rec.lang = lang === "bn" ? "bn-IN" : lang === "ta" ? "ta-IN" : "hi-IN";
      rec.interimResults = false;
      rec.onstart = () => { runningRef.current = true; setListening(true); };
      rec.onresult = (e: any) => {
        const t = e.results[0][0].transcript as string;
        setTranscript(t);
        const r = getReplyHindi(t);
        setReply(r);
        synthesize(r, lang === "en" ? "en-US" : lang === "bn" ? "bn-IN" : lang === "ta" ? "ta-IN" : "hi-IN");
      };
      const stopAll = () => { runningRef.current = false; setListening(false); };
      rec.onend = stopAll;
      rec.onerror = stopAll;
      recRef.current = rec;
    }
    return () => {
      try { recRef.current?.abort?.(); } catch {}
    };
  }, [lang]);

  const start = () => {
    const rec = recRef.current;
    if (!rec) {
      const text = "क्षमा करें, आपके ब्राउज़र में वॉइस सपोर्ट उपलब्ध नहीं है।";
      setReply(text);
      synthesize(text, "hi-IN");
      return;
    }
    setTranscript("");
    setReply("");
    if (runningRef.current) {
      try { rec.stop(); } catch {}
      // start after a short delay when previous session ends
      setTimeout(() => { if (!runningRef.current) { try { rec.start(); } catch {} } }, 300);
    } else {
      try { rec.start(); } catch {}
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-white/70 backdrop-blur rounded-xl border shadow-sm">
      <div className="flex items-center gap-3">
        <Button onClick={start} size="lg" className={`rounded-full h-14 w-14 p-0 ${listening ? "animate-pulse" : ""} bg-gradient-to-r from-green-600 to-emerald-600`} aria-label="Mic">
          <Mic />
        </Button>
        <div className="text-sm text-muted-foreground">
          {listening ? "सुन रहा है..." : "बोलने के लिए माइक बटन दबाएँ"}
        </div>
      </div>
      {(transcript || reply) && (
        <div className="mt-3 space-y-2 text-sm">
          {transcript && (
            <p><span className="font-semibold">आप:</span> {transcript}</p>
          )}
          {reply && (
            <p><span className="font-semibold">सहायक:</span> {reply}</p>
          )}
        </div>
      )}
    </div>
  );
}
