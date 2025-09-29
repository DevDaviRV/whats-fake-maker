import { useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { ExportFormat } from "@/components/ExportDialog";

export function useVideoExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportVideo = useCallback(
    async (
      chatElement: HTMLElement,
      animationCallback: () => Promise<void>,
      format: ExportFormat
    ) => {
      if (!chatElement) {
        toast.error("Elemento não encontrado");
        return;
      }

      setIsExporting(true);

      try {
        // Criar canvas
        const canvas = document.createElement("canvas");
        canvas.width = format.width;
        canvas.height = format.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Não foi possível criar contexto canvas");
        }

        // Configurar MediaRecorder
        const stream = canvas.captureStream(30);
        const chunks: Blob[] = [];
        
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm";
        
        // Configurar qualidade do canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 10000000, // 10 Mbps para melhor qualidade
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        const recordingComplete = new Promise<void>((resolve) => {
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `whatsapp-conversa-${Date.now()}.webm`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 100);
            resolve();
          };
        });

        toast.info("Gravando vídeo...");
        mediaRecorder.start();

        // Função para capturar e desenhar no canvas
        const captureAndDraw = async () => {
          const dataUrl = await toPng(chatElement, {
            quality: 1,
            pixelRatio: 2, // Alta resolução
            cacheBust: true,
            width: chatElement.scrollWidth,
            height: chatElement.scrollHeight,
          });

          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              // Limpar canvas com fundo preto
              ctx.fillStyle = "#0a0a0a";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // Adicionar padding (8% de cada lado)
              const paddingPercent = 0.08;
              const paddingX = canvas.width * paddingPercent;
              const paddingY = canvas.height * paddingPercent;
              
              // Área disponível após padding
              const availableWidth = canvas.width - (paddingX * 2);
              const availableHeight = canvas.height - (paddingY * 2);
              
              // Calcular escala para caber na área disponível mantendo proporção
              const scaleX = availableWidth / img.width;
              const scaleY = availableHeight / img.height;
              const scale = Math.min(scaleX, scaleY); // Usar min para caber completamente
              
              // Calcular dimensões finais
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;
              
              // Centralizar a imagem na área disponível
              const x = paddingX + (availableWidth - scaledWidth) / 2;
              const y = paddingY + (availableHeight - scaledHeight) / 2;
              
              ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
              resolve();
            };
            img.src = dataUrl;
          });
        };

        // Executar animação com captura contínua
        const captureInterval = setInterval(captureAndDraw, 33); // ~30fps

        await animationCallback();

        // Aguardar última captura
        await captureAndDraw();
        clearInterval(captureInterval);

        // Parar gravação
        mediaRecorder.stop();
        await recordingComplete;

        toast.success("Vídeo exportado com sucesso!");
      } catch (error) {
        console.error("Erro ao exportar:", error);
        toast.error("Erro ao exportar vídeo. Tente novamente.");
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return {
    exportVideo,
    isExporting,
  };
}
