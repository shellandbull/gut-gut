export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.02_265)] via-[oklch(0.15_0.03_280)] to-[oklch(0.10_0.02_250)]" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[oklch(0.75_0.25_195)] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[oklch(0.65_0.35_330)] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[oklch(0.55_0.3_300)] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10 flex flex-col items-center gap-8 px-8">
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-center">
          <span className="inline-block bg-gradient-to-r from-[oklch(0.75_0.25_195)] via-[oklch(0.65_0.35_330)] to-[oklch(0.85_0.25_85)] bg-clip-text text-transparent animate-[gradient_3s_ease-in-out_infinite] drop-shadow-[0_0_30px_oklch(0.75_0.25_195)]"
            style={{
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Hello World
          </span>
        </h1>

        <div className="flex gap-6 items-center justify-center flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-lg bg-[oklch(0.75_0.25_195)] shadow-[0_0_30px_oklch(0.75_0.25_195)] transition-all hover:scale-110" />
            <span className="text-xs font-mono text-[oklch(0.75_0.25_195)]">Cyan</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-lg bg-[oklch(0.65_0.35_330)] shadow-[0_0_30px_oklch(0.65_0.35_330)] transition-all hover:scale-110" />
            <span className="text-xs font-mono text-[oklch(0.65_0.35_330)]">Pink</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-lg bg-[oklch(0.85_0.25_85)] shadow-[0_0_30px_oklch(0.85_0.25_85)] transition-all hover:scale-110" />
            <span className="text-xs font-mono text-[oklch(0.85_0.25_85)]">Yellow</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-lg bg-[oklch(0.55_0.3_300)] shadow-[0_0_30px_oklch(0.55_0.3_300)] transition-all hover:scale-110" />
            <span className="text-xs font-mono text-[oklch(0.55_0.3_300)]">Purple</span>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}
