export default function Header() {
  return (
    <header className="border-b border-border bg-surface/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">UGC Creator Studio</h1>
            <p className="text-muted text-sm mt-1">
              Generate hyper-realistic AI UGC influencer prompts
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted uppercase tracking-wide">Powered by</div>
              <div className="text-sm font-medium text-primary">Claude Code Skill</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
