export default function AnimatedBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-green-100/70 via-emerald-100/30 to-transparent" />
      <svg className="absolute -top-10 right-0 w-[600px] opacity-30" viewBox="0 0 600 400" fill="none">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle cx="500" cy="60" r="40" stroke="url(#g)" strokeWidth="6" fill="none">
          <animate attributeName="r" values="30;40;30" dur="6s" repeatCount="indefinite" />
        </circle>
        <g>
          <path d="M20 350 C 200 280, 300 320, 580 200" stroke="url(#g)" strokeWidth="2" strokeDasharray="4 6" />
          <circle cx="20" cy="350" r="4" fill="#16a34a">
            <animate attributeName="cy" values="350;345;350" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="580" cy="200" r="4" fill="#059669" />
        </g>
      </svg>
      <div className="absolute -left-10 -bottom-10 h-72 w-72 rounded-full bg-green-300/20 blur-3xl animate-pulse" />
      <div className="absolute -right-10 -bottom-20 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl animate-pulse [animation-duration:5s]" />
    </div>
  );
}
