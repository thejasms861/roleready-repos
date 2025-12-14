import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function UrlInput({ onSubmit, isLoading, disabled }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isValidUrl = url.match(/^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidUrl && !isLoading && !disabled) {
      onSubmit(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "relative flex items-center rounded-lg border transition-all duration-200",
          isFocused
            ? "border-primary shadow-lg ring-2 ring-primary/20"
            : "border-border",
          "bg-card/80 backdrop-blur-sm"
        )}
      >
        <div className="flex items-center pl-4 text-muted-foreground">
          <Github className="w-5 h-5" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="https://github.com/username/repository"
          className="flex-1 h-14 px-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-mono text-sm"
          disabled={isLoading || disabled}
        />
        <div className="pr-2">
          <Button
            type="submit"
            variant="insight"
            size="sm"
            disabled={!isValidUrl || isLoading || disabled}
            className="h-10 px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Analyze
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
      {url && !isValidUrl && (
        <p className="mt-2 text-sm text-destructive font-mono">
          Please enter a valid GitHub repository URL
        </p>
      )}
    </form>
  );
}
