import { useState } from "react";
import { Plus, Play, Download, Upload, FileJson, Settings, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation, Message } from "@/types/chat";
import { MessageEditor } from "./MessageEditor";
import { SettingsDialog } from "./SettingsDialog";
import { templates } from "@/utils/conversationTemplates";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditorPanelProps {
  conversation: Conversation;
  onUpdateConversation: (conversation: Conversation) => void;
  onPlay: () => void;
  isPlaying: boolean;
}

export function EditorPanel({
  conversation,
  onUpdateConversation,
  onPlay,
  isPlaying,
}: EditorPanelProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleAddMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: "Nova mensagem",
      sender: "own",
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };
    
    onUpdateConversation({
      ...conversation,
      messages: [...conversation.messages, newMessage],
    });
  };

  const handleUpdateMessage = (messageId: string, updates: Partial<Message>) => {
    onUpdateConversation({
      ...conversation,
      messages: conversation.messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    onUpdateConversation({
      ...conversation,
      messages: conversation.messages.filter((msg) => msg.id !== messageId),
    });
  };

  const handleMoveMessage = (messageId: string, direction: "up" | "down") => {
    const currentIndex = conversation.messages.findIndex((m) => m.id === messageId);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === conversation.messages.length - 1)
    ) {
      return;
    }

    const newMessages = [...conversation.messages];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    [newMessages[currentIndex], newMessages[targetIndex]] = [
      newMessages[targetIndex],
      newMessages[currentIndex],
    ];

    onUpdateConversation({
      ...conversation,
      messages: newMessages,
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(conversation, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `conversa-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Conversa exportada com sucesso!");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string) as Conversation;
          onUpdateConversation(imported);
          toast.success("Conversa importada com sucesso!");
        } catch (error) {
          toast.error("Erro ao importar conversa. Verifique o arquivo.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = templates[templateId];
    if (template) {
      onUpdateConversation(template);
      toast.success("Template carregado!");
    }
  };

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Editor</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-800">
            <strong>Aviso:</strong> Esta ferramenta gera simulações. Não use para
            enganar, fraudar ou se passar por terceiros.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Template</label>
          <Select onValueChange={handleLoadTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Carregar template..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vendas">💰 Vendas</SelectItem>
              <SelectItem value="suporte">🛠️ Suporte</SelectItem>
              <SelectItem value="convite">🎉 Convite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onPlay}
            variant={isPlaying ? "secondary" : "default"}
            size="sm"
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            {isPlaying ? "Animando..." : "Preview"}
          </Button>
          <Button onClick={handleAddMessage} variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button
            onClick={handleImport}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {conversation.messages.map((message, index) => (
            <MessageEditor
              key={message.id}
              message={message}
              onUpdate={(updates) => handleUpdateMessage(message.id, updates)}
              onDelete={() => handleDeleteMessage(message.id)}
              onMove={(direction) => handleMoveMessage(message.id, direction)}
              canMoveUp={index > 0}
              canMoveDown={index < conversation.messages.length - 1}
            />
          ))}
        </div>
      </ScrollArea>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        conversation={conversation}
        onUpdateConversation={onUpdateConversation}
      />
    </div>
  );
}
