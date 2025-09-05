export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto rounded-xl border bg-white/70 backdrop-blur p-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2">This page will be implemented next. Continue prompting to fill in the content.</p>
      </div>
    </div>
  );
}
