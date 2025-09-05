import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { estimate, EstimationResult, ProjectInput, ProjectType, sha256Hex } from "@/components/agri/Estimator";
import { Camera, GalleryHorizontal, MapPin, Mic, Sparkles } from "lucide-react";
import Confetti from "@/components/agri/Confetti";

function useGeo() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const detect = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };
  return { coords, detect };
}

export default function AddProject() {
  const { coords, detect } = useGeo();
  const [projectType, setProjectType] = useState<ProjectType>("Agroforestry");
  const [areaHa, setAreaHa] = useState<string>("1");
  const [crop, setCrop] = useState<string>("Mixed Crops");
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [hash, setHash] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const voiceRef = useRef<any>(null);

  useEffect(() => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.lang = "hi-IN";
      rec.onresult = (e: any) => {
        const t = e.results[0][0].transcript as string;
        setDescription((p) => (p ? p + " " : "") + t);
      };
      voiceRef.current = rec;
    }
  }, []);

  const startVoiceFill = () => {
    const rec = voiceRef.current;
    if (!rec) return;
    try {
      if ((rec as any)._running) {
        rec.stop();
        setTimeout(() => { try { rec.start(); } catch {} }, 300);
      } else {
        (rec as any)._running = true;
        rec.onstart = () => ((rec as any)._running = true);
        rec.onend = () => ((rec as any)._running = false);
        rec.onerror = () => ((rec as any)._running = false);
        rec.start();
      }
    } catch {}
  };

  const onSelectFiles = (files: FileList | null) => {
    if (!files) return;
    const readers = Array.from(files).slice(0, 6).map(
      (f) =>
        new Promise<string>((resolve) => {
          const fr = new FileReader();
          fr.onload = () => resolve(fr.result as string);
          fr.readAsDataURL(f);
        }),
    );
    Promise.all(readers).then((arr) => setImages((prev) => [...prev, ...arr]));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ProjectInput = {
      projectType,
      areaHa: parseFloat(areaHa) || 0,
      crop,
      lat: coords?.lat,
      lon: coords?.lon,
    };
    const est = estimate(payload);
    setResult(est);
    const chainData = {
      payload,
      est,
      ts: Date.now(),
      imagesCount: images.length,
      description,
    };
    const h = await sha256Hex(chainData);
    setHash(h);
    const record = { id: h.slice(0, 8), ...chainData, hash: h, images };
    const prev = JSON.parse(localStorage.getItem("agrimrv.projects") || "[]");
    localStorage.setItem("agrimrv.projects", JSON.stringify([record, ...prev]));
    setSuccess(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  return (
    <section className="relative">
      {success && <Confetti />}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Add Project</h1>
        <p className="text-sm text-muted-foreground mt-1">GPS, फोटो और वॉइस से आसान रजिस्ट्रेशन</p>
        {!success ? (
          <form onSubmit={onSubmit} className="mt-6 grid gap-4 max-w-3xl">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-medium">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as ProjectType)}
                className="h-10 border rounded-md px-2 bg-white"
              >
                <option>Agroforestry</option>
                <option>Rice</option>
                <option>Mixed</option>
              </select>

              <label className="text-sm font-medium">Area (hectares)</label>
              <input
                type="number"
                min={0}
                step="0.1"
                value={areaHa}
                onChange={(e) => setAreaHa(e.target.value)}
                className="h-10 border rounded-md px-3"
                required
              />

              <label className="text-sm font-medium">Crop Type</label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="h-10 border rounded-md px-3"
              />

              <label className="text-sm font-medium flex items-center gap-2">Farm Location <MapPin className="h-4 w-4" /></label>
              <div className="flex gap-2 items-center">
                <Button type="button" variant="secondary" onClick={detect} className="bg-green-50 text-foreground">
                  Use GPS
                </Button>
                <a
                  className="text-sm underline"
                  href={
                    coords
                      ? `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=14/${coords.lat}/${coords.lon}`
                      : `https://www.openstreetmap.org/`
                  }
                  target="_blank"
                >
                  Open Map
                </a>
              </div>
              {coords && (
                <div className="col-span-2 text-sm text-muted-foreground">Lat: {coords.lat.toFixed(5)}, Lon: {coords.lon.toFixed(5)}</div>
              )}
            </div>

            <div className="mt-2">
              <label className="text-sm font-medium">Upload Photos</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <label className="h-24 border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer bg-white">
                  <Camera className="h-5 w-5 text-primary" />
                  <span className="text-xs">Camera</span>
                  <input className="hidden" type="file" accept="image/*" capture="environment" multiple onChange={(e) => onSelectFiles(e.target.files)} />
                </label>
                <label className="h-24 border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer bg-white">
                  <GalleryHorizontal className="h-5 w-5 text-primary" />
                  <span className="text-xs">Gallery</span>
                  <input className="hidden" type="file" accept="image/*" multiple onChange={(e) => onSelectFiles(e.target.files)} />
                </label>
                <button type="button" onClick={startVoiceFill} className="h-24 border rounded-lg flex flex-col items-center justify-center gap-2 bg-white">
                  <Mic className="h-5 w-5 text-primary" />
                  <span className="text-xs">Voice Fill</span>
                </button>
              </div>
              {images.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {images.map((src, i) => (
                    <img key={i} src={src} alt="upload" className="h-20 w-20 object-cover rounded-md border" />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">Description <Mic className="h-4 w-4" /></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full min-h-24 border rounded-md p-3"
                placeholder="अपने खेत/परियोजना के बारे में बताएँ"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600">
                <Sparkles className="mr-2 h-4 w-4" /> Calculate & Verify
              </Button>
              <Button type="button" variant="secondary" onClick={() => { setImages([]); setDescription(""); }}>
                Reset
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-6 max-w-3xl bg-white/70 backdrop-blur border rounded-xl p-5">
            <h2 className="text-xl font-bold">Your project is added and verified successfully!</h2>
            <p className="text-sm text-muted-foreground">Blockchain Hash: <span className="font-mono break-all">{hash}</span></p>
            {result && (
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <Stat title="CO₂ Captured" value={`${result.co2Tons} tCO₂e`} />
                <Stat title="Carbon Credits" value={`${result.credits}`} />
                <Stat title="Income (₹)" value={`₹${result.incomeINR.toLocaleString()}`} />
                <Progress title="Water Saved" percent={Math.min(100, Math.round(result.waterSavedKL / 2))} tone="emerald" />
                <Progress title="Environment" percent={result.envScore} tone="green" />
                <Progress title="Community" percent={result.communityImpact} tone="lime" />
              </div>
            )}
            <div className="mt-5 flex gap-3">
              <a href="/dashboard" className="inline-flex h-10 px-4 items-center justify-center rounded-md bg-primary text-primary-foreground">Go to Dashboard</a>
              <a href="/" className="inline-flex h-10 px-4 items-center justify-center rounded-md border">Back Home</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 rounded-lg border bg-white">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function Progress({ title, percent, tone }: { title: string; percent: number; tone: "emerald" | "green" | "lime" }) {
  const color = tone === "emerald" ? "bg-emerald-500" : tone === "green" ? "bg-green-500" : "bg-lime-500";
  return (
    <div className="p-4 rounded-lg border bg-white">
      <div className="text-xs text-muted-foreground mb-2">{title}</div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <div className="text-xs text-right mt-1 text-muted-foreground">{percent}%</div>
    </div>
  );
}
