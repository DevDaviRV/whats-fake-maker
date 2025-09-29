import { Plus, Smile, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatInput() {
  return (
    <footer className="bg-card border-t border-border p-3 flex items-center gap-2">
      <Button variant="ghost" size="icon" className="rounded-full">
        <Plus className="h-5 w-5 text-muted-foreground" />
      </Button>
      
      <div className="flex-1 flex items-center gap-2 bg-input rounded-full px-4 py-2">
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
          <Smile className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Input
          placeholder="Mensagem"
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
          disabled
        />
      </div>
      
      <Button variant="ghost" size="icon" className="rounded-full">
        <Mic className="h-5 w-5 text-muted-foreground" />
      </Button>
    </footer>
  );
}
