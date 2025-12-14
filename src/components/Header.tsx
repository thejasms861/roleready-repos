import { GitBranch } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
              <GitBranch className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold tracking-tight">Repository Mirror</span>
          </a>
          <nav className="flex items-center gap-6">
            <span className="text-xs font-mono text-muted-foreground px-3 py-1 rounded-full bg-muted/50 border border-border">
              v1.0
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
}
