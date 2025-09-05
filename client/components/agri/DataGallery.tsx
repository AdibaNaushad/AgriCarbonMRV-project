import { Leaf, Sprout, Satellite, Waves } from "lucide-react";

function Placeholder({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="relative rounded-xl border bg-gradient-to-br from-emerald-50 to-green-50 p-4 flex items-center justify-center">
      <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-emerald-200/40 blur-2xl" />
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-green-200/40 blur-2xl" />
      <div className="relative text-center">
        <div className="mx-auto h-10 w-10 rounded-md bg-white/70 border flex items-center justify-center text-emerald-700">{icon}</div>
        <div className="text-xs mt-1 text-emerald-800 font-medium">{label}</div>
      </div>
    </div>
  );
}

export default function DataGallery() {
  let imgs: string[] = [];
  try {
    const items = JSON.parse(localStorage.getItem("agrimrv.projects") || "[]");
    imgs = items.flatMap((r: any) => r.images || []).slice(0, 4);
  } catch {}

  if (imgs.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Placeholder icon={<Satellite className="h-5 w-5" />} label="Satellite" />
        <Placeholder icon={<Sprout className="h-5 w-5" />} label="Farms" />
        <Placeholder icon={<Leaf className="h-5 w-5" />} label="Eco" />
        <Placeholder icon={<Waves className="h-5 w-5" />} label="Water" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {imgs.map((src, i) => (
        <div key={i} className="relative overflow-hidden rounded-xl border">
          <img src={src} alt={`project ${i + 1}`} className="h-32 w-full object-cover" />
          <span className="absolute bottom-1 right-1 text-[10px] bg-white/80 border rounded px-1">Photo</span>
        </div>
      ))}
    </div>
  );
}
