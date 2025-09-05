import Chatbot from "@/components/agri/Chatbot";

export default function Support() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Support & Help Center</h1>
      <p className="text-sm text-muted-foreground">Chatbot, FAQs, tutorials and helpline.</p>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <section className="rounded-xl border bg-white/70 backdrop-blur p-4">
            <h2 className="font-semibold">About Carbon Credits</h2>
            <p className="text-sm text-muted-foreground mt-1">कार्बन क्रेडिट वह प्रमाण है जो CO₂ उत्सर्जन घटाने/सेक्वेस्ट्रेशन करने पर मिलता है। एक क्रेडिट ≈ 1 टन CO₂e. हमारे प्लेटफॉर्म पर परियोजना जोड़ते ही अनुमानित क्रेडिट और आय दिखाई जाती है।</p>
          </section>

          <section className="rounded-xl border bg-white/70 backdrop-blur p-4">
            <h2 className="font-semibold">FAQ</h2>
            <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
              <li>कैमरा कैसे खुलेगा? — Add Project में Camera चुनें और फोटो लें।</li>
              <li>आय कैसे गिनी जाती है? — अनुमानित क्रेडिट × ₹800 प्रति क्रेडिट।</li>
              <li>ब्लॉकचेन क्या है? — SHA-256 हैश से परियोजना की सत्यता सुरक्षित रहती है।</li>
            </ul>
          </section>

          <section className="rounded-xl border bg-white/70 backdrop-blur p-4">
            <h2 className="font-semibold mb-2">Chatbot</h2>
            <Chatbot />
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
            <h3 className="font-semibold">Helpline</h3>
            <div className="text-sm">1800-270-2222</div>
            <div className="text-xs text-muted-foreground">Official Address: Kolkata, West Bengal</div>
          </div>
          <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
            <h3 className="font-semibold">Farmer Query Number</h3>
            <a href="tel:18002702222" className="text-sm text-emerald-700 underline">1800-270-2222</a>
          </div>
          <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
            <h3 className="font-semibold">Website</h3>
            <a href="/" className="text-sm text-emerald-700 underline">https://agricarbonmrv.local</a>
          </div>
          <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
            <h3 className="font-semibold">Tutorials</h3>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>परियोजना जोड़ना (GPS/Camera/Voice)</li>
              <li>ब्लॉकचेन सत्यापन देखना</li>
              <li>डैशबोर्ड में आँकड़े समझना</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
