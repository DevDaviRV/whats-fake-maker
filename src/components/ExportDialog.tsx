import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartExport: (format: ExportFormat) => void;
  isExporting: boolean;
}

export interface ExportFormat {
  name: string;
  width: number;
  height: number;
  format: "webm" | "mp4";
}

const exportFormats: Record<string, ExportFormat> = {
  "instagram-story": {
    name: "Instagram Story (9:16)",
    width: 1080,
    height: 1920,
    format: "webm",
  },
  "instagram-post": {
    name: "Instagram Post (1:1)",
    width: 1080,
    height: 1080,
    format: "webm",
  },
  "tiktok": {
    name: "TikTok (9:16)",
    width: 1080,
    height: 1920,
    format: "webm",
  },
  "youtube-shorts": {
    name: "YouTube Shorts (9:16)",
    width: 1080,
    height: 1920,
    format: "webm",
  },
  "facebook-story": {
    name: "Facebook Story (9:16)",
    width: 1080,
    height: 1920,
    format: "webm",
  },
  "twitter": {
    name: "Twitter/X (16:9)",
    width: 1280,
    height: 720,
    format: "webm",
  },
  "custom": {
    name: "Personalizado (9:16)",
    width: 1080,
    height: 1920,
    format: "webm",
  },
};

export function ExportDialog({
  open,
  onOpenChange,
  onStartExport,
  isExporting,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("instagram-story");

  const handleExport = () => {
    const format = exportFormats[selectedFormat];
    if (format) {
      onStartExport(format);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Vídeo</DialogTitle>
          <DialogDescription>
            Escolha o formato ideal para sua rede social
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Formato</label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(exportFormats).map(([key, format]) => (
                  <SelectItem key={key} value={key}>
                    {format.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted rounded-lg p-3 space-y-1">
            <p className="text-xs text-muted-foreground">
              <strong>Resolução:</strong>{" "}
              {exportFormats[selectedFormat].width} x{" "}
              {exportFormats[selectedFormat].height}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Formato:</strong> {exportFormats[selectedFormat].format.toUpperCase()}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 <strong>Dica:</strong> Clique em "Preview" antes de exportar para
              ver a animação completa.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isExporting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            className="flex-1"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
