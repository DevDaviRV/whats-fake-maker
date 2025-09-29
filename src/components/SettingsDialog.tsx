import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: Conversation;
  onUpdateConversation: (conversation: Conversation) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  conversation,
  onUpdateConversation,
}: SettingsDialogProps) {
  const [contactName, setContactName] = useState(conversation.contact.name);
  const [contactStatus, setContactStatus] = useState(conversation.contact.status || "");
  const [contactAvatar, setContactAvatar] = useState(conversation.contact.avatar || "");
  const [userName, setUserName] = useState(conversation.user.name);
  const [userAvatar, setUserAvatar] = useState(conversation.user.avatar || "");
  const [showWatermark, setShowWatermark] = useState(conversation.showWatermark);

  const handleSave = () => {
    onUpdateConversation({
      ...conversation,
      contact: {
        name: contactName,
        status: contactStatus,
        avatar: contactAvatar || undefined,
      },
      user: {
        name: userName,
        avatar: userAvatar || undefined,
      },
      showWatermark,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurações da Conversa</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Contato</h3>
            
            <div className="space-y-2">
              <Label htmlFor="contact-name">Nome</Label>
              <Input
                id="contact-name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Nome do contato"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-status">Status</Label>
              <Input
                id="contact-status"
                value={contactStatus}
                onChange={(e) => setContactStatus(e.target.value)}
                placeholder="ex: online, disponível"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-avatar">Avatar (URL ou emoji)</Label>
              <div className="flex gap-2">
                <Input
                  id="contact-avatar"
                  value={contactAvatar}
                  onChange={(e) => setContactAvatar(e.target.value)}
                  placeholder="https://... ou 😊"
                  className="flex-1"
                />
                {contactAvatar && (
                  <Avatar>
                    <AvatarFallback>
                      {contactAvatar.startsWith("http") ? "👤" : contactAvatar}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Você</h3>
            
            <div className="space-y-2">
              <Label htmlFor="user-name">Nome</Label>
              <Input
                id="user-name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-avatar">Avatar (URL ou emoji)</Label>
              <div className="flex gap-2">
                <Input
                  id="user-avatar"
                  value={userAvatar}
                  onChange={(e) => setUserAvatar(e.target.value)}
                  placeholder="https://... ou 😊"
                  className="flex-1"
                />
                {userAvatar && (
                  <Avatar>
                    <AvatarFallback>
                      {userAvatar.startsWith("http") ? "👤" : userAvatar}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="watermark">Marca d'água "SIMULADO"</Label>
              <p className="text-xs text-muted-foreground">
                Recomendado para uso ético
              </p>
            </div>
            <Switch
              id="watermark"
              checked={showWatermark}
              onCheckedChange={setShowWatermark}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
