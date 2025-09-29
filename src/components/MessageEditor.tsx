import { useState } from "react";
import { Trash2, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Message, MessageSender, MessageStatus } from "@/types/chat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MessageEditorProps {
  message: Message;
  onUpdate: (updates: Partial<Message>) => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function MessageEditor({
  message,
  onUpdate,
  onDelete,
  onMove,
  canMoveUp,
  canMoveDown,
}: MessageEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-3 space-y-2">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Textarea
            value={message.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Texto da mensagem"
            className="min-h-[60px] text-sm"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onMove("up")}
            disabled={!canMoveUp}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onMove("down")}
            disabled={!canMoveDown}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Remetente
          </label>
          <Select
            value={message.sender}
            onValueChange={(value: MessageSender) => onUpdate({ sender: value })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="own">Você</SelectItem>
              <SelectItem value="contact">Contato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Horário
          </label>
          <Input
            type="text"
            value={message.timestamp}
            onChange={(e) => onUpdate({ timestamp: e.target.value })}
            placeholder="HH:mm"
            className="h-8 text-sm"
          />
        </div>

        {message.sender === "own" && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Status
            </label>
            <Select
              value={message.status}
              onValueChange={(value: MessageStatus) => onUpdate({ status: value })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sent">Enviado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="read">Lido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {message.image && (
        <div className="relative">
          <img
            src={message.image}
            alt="Preview"
            className="w-full rounded border border-border"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={() => onUpdate({ image: undefined })}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {!message.image && (
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            URL da Imagem (opcional)
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="https://..."
              className="h-8 text-sm flex-1"
              onBlur={(e) => {
                if (e.target.value) {
                  onUpdate({ image: e.target.value });
                }
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
