import { useEffect, useRef, useState } from "react";
import { Mic, Volume2, X } from "lucide-react";

function tts(text: string) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "hi-IN";
  u.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function getHindiAnswer(q: string): string {
  const s = q.toLowerCase();
  const rules: { keys: string[]; a: string }[] = [
    { keys: ["what is carbon", "कार्बन क्रेडिट", "carbon credit", "क्रेडिट क्या"], a: "कार्बन क्रेडिट वह प्रमाण है जो CO₂ उत्सर्जन घटाने या कार्बन को मिट्टी/पेड़ों में बाँधने पर मिलता है। लगभग 1 क्रेडिट = 1 टन CO₂e।" },
    { keys: ["how earn", "earn", "आय", "कमाई", "कैसे कमाएँ", "how to get"], a: "आप अपनी खेती की परियोजना जोड़ें—जैसे एग्रोफॉरेस्ट्री, धान या मिक्स्ड। सिस्टम MRV के आधार पर अनुमानित CO₂ कैप्चर और क्रेडिट दिखाएगा, जिनसे आय होती है।" },
    { keys: ["price", "कीमत", "rate", "प्राइस"], a: "डेमो के लिए प्रति क्रेडिट ₹800 मानकर आय दिखाई जाती है। असली बाज़ार में कीमत आपूर्ति और माँग पर निर्भर करती है।" },
    { keys: ["agroforestry", "पेड़", "बागवानी"], a: "एग्रोफॉरेस्ट्री में पेड़ + फसल से कार्बन कैप्चर अधिक होता है, इसलिए क्रेडिट भी अधिक मिलते हैं।" },
    { keys: ["rice", "धान"], a: "धान में पानी की बचत और मीथेन घटाने के उपायों से क्रेडिट बनते हैं—जैसे AWD सिंचाई, बेहतर प्रबंधन।" },
    { keys: ["mrv", "measurement", "report", "verify", "सत्यापन"], a: "MRV = मापन, रिपोर्टिंग और सत्यापन। उपग्रह, फ़ोटो, GPS और खेत की जानकारी के आधार पर अनुमान पारदर्शी रहता है।" },
    { keys: ["blockchain", "ब्लॉकचेन", "hash", "हैश"], a: "परियोजना का SHA-256 हैश बनाकर रिकॉर्ड किया जाता है ताकि डेटा छेड़छाड़-रोधी और सत्यापन योग्य रहे।" },
    { keys: ["sell", "purchase", "खरीद", "बेचना"], a: "कंपनियाँ कार्बन मार्केट ��ेज से क्रेडिट खरीदती हैं। किसान को पारदर्शी रूप से आय दिखती है।" },
    { keys: ["eligibility", "योग्यता", "कौन", "who"], a: "छोटे किसान, समूह या FPO अपनी ज़मीन/परियोजनाएँ जोड़कर पात्र हो सकते हैं, स्थानीय नियमों का पालन आवश्यक है।" },
    { keys: ["documents", "दस्तावेज", "कागज"], a: "बुनियादी ज़मीन/खेत विवरण, स्थान (GPS), फसल या प्रैक्टिस की जानकारी और फ़ोटो/प्रमाण आवश्यक होते हैं।" },
    { keys: ["payment", "भुगतान"], a: "क्रेडिट बिक्री पर आय किसान के खाते में आती है। प्लेटफ़ॉर्म पर अनुमानित आय और स्टेटस दिखता है।" },
    { keys: ["timeline", "कितने दिन", "समय"], a: "परियोजना जोड़ते ही अनुमान दिखत��� है। सत्यापन और बिक्री प्रक्रिया नीति और खरीदार पर निर्भर करती है।" },
  ];
  for (const r of rules) if (r.keys.some((k) => s.includes(k))) return r.a;
  return "मैं कार्बन क्रेडिट से जुड़े आपके प्रश्नों का उत्तर दे सकता हूँ—जैसे कीमत, कमाई, MRV, ब्लॉकचेन, योग्यता और बिक्री। कृपया अपना प्रश्न बोलें।";
}

export default function FloatingVoice() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const recRef = useRef<any>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    try { recRef.current?.abort?.(); } catch {}
    if (SR) {
      const rec = new SR();
      rec.lang = "hi-IN";
      rec.continuous = false;
      rec.interimResults = false;
      rec.onstart = () => { runningRef.current = true; setListening(true); };
      rec.onresult = (e: any) => {
        const t = e.results[0][0].transcript as string;
        setTranscript(t);
        const a = getHindiAnswer(t);
        setAnswer(a);
        tts(a);
      };
      const stop = () => { runningRef.current = false; setListening(false); };
      rec.onend = stop;
      rec.onerror = stop;
      recRef.current = rec;
    }
    return () => { try { recRef.current?.abort?.(); } catch {} };
  }, []);

  const start = () => {
    const rec = recRef.current;
    if (!rec) { const a = "क्षमा करें, आपके ब्राउज़र में वॉइस सपोर्ट उपलब्ध नहीं है।"; setAnswer(a); tts(a); return; }
    setTranscript("");
    setAnswer("");
    if (runningRef.current) { try { rec.stop(); } catch {}; setTimeout(() => { if (!runningRef.current) try { rec.start(); } catch {} }, 250); }
    else { try { rec.start(); } catch {} }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 w-72 rounded-xl border bg-white/90 backdrop-blur shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">हिंदी वॉइस सहायक</div>
            <button className="text-foreground/60 hover:text-foreground" onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4"/></button>
          </div>
          {transcript && <div className="text-xs mb-1"><span className="font-medium">सुना:</span> {transcript}</div>}
          {answer && <div className="text-sm bg-emerald-50 border border-emerald-200 rounded p-2 flex items-start gap-2"><Volume2 className="h-4 w-4 text-emerald-700 mt-0.5"/>{answer}</div>}
          {!answer && <div className="text-xs text-muted-foreground">कार्बन क्रेडिट से जुड़ा प्रश्न बोलें—जैसे कीमत, कमाई, MRV, ब्लॉकचेन…</div>}
        </div>
      )}
      <button onClick={() => (open ? start() : setOpen(true))} className={`h-14 w-14 rounded-full shadow-lg text-white ${listening ? "animate-pulse" : ""} bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center`} aria-label="Hindi Voice Assistant">
        <Mic className="h-6 w-6" />
      </button>
    </div>
  );
}
