import { useEffect, useRef } from "react";

export default function Confetti() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const count = 80;
    const colors = ["#16a34a", "#10b981", "#84cc16", "#22c55e", "#34d399"];
    const children: HTMLDivElement[] = [];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.style.position = "absolute";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.top = "-10px";
      piece.style.width = "8px";
      piece.style.height = "14px";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.opacity = "0.9";
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      piece.style.animation = `fall ${3 + Math.random() * 2}s linear forwards`;
      piece.style.animationDelay = `${Math.random()}s`;
      piece.style.borderRadius = "2px";
      el.appendChild(piece);
      children.push(piece);
    }
    return () => {
      children.forEach((c) => c.remove());
    };
  }, []);
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 overflow-hidden" />
  );
}

// Global keyframes (once)
const style = document.createElement("style");
style.innerHTML = `@keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0.8; } }`;
document.head.appendChild(style);
