import { Wifi, Signal, Battery } from "lucide-react";

export function StatusBar() {
  const currentTime = new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bg-header text-white px-4 pt-2 pb-1 flex items-center justify-between text-xs font-semibold shrink-0">
      <div className="flex items-center gap-1">
        <span>{currentTime}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <Battery className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
