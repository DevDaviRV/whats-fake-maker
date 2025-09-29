import { Plus, Smile, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatInput() {
  return (
    <footer className="bg-card border-t border-border p-2 flex items-center gap-1.5 shrink-0">
      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
        <Plus className="h-4 w-4 text-muted-foreground" />
      </Button>
      
      <div className="flex-1 flex items-center gap-1.5 bg-input rounded-full px-3 py-1.5">
        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
          <Smile className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Input
          placeholder="Mensagem"
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-xs"
          disabled
        />
      </div>
      
      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
        <Mic className="h-4 w-4 text-muted-foreground" />
      </Button>
    </footer>
  );
}
