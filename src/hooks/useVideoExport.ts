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
          : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
          ? "video/webm;codecs=vp8"
          : "video/webm";
        
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
            pixelRatio: 2, // Maior resolução
            cacheBust: true,
            skipAutoScale: true,
          });

          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              // Limpar canvas com cor de fundo
              ctx.fillStyle = "#0a0a0a";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // Calcular escala mantendo proporção e margens
              const padding = 0; // sem padding para usar toda a área
              const availableWidth = canvas.width - (padding * 2);
              const availableHeight = canvas.height - (padding * 2);
              
              const scale = Math.min(
                availableWidth / img.width,
                availableHeight / img.height
              );
              
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;
              const x = padding + (availableWidth - scaledWidth) / 2;
              const y = padding + (availableHeight - scaledHeight) / 2;
              
              // Usar imageSmoothingEnabled para melhor qualidade
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              
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
