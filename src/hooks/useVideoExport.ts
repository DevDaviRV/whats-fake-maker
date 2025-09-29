import { useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { ExportFormat } from "@/components/ExportDialog";

export function useVideoExport() {
  const [isExporting, setIsExporting] = useState(false);

  const captureFrame = async (element: HTMLElement): Promise<string> => {
    return await toPng(element, {
      quality: 1,
      pixelRatio: 2,
    });
  };

  const exportVideo = useCallback(
    async (
      chatElement: HTMLElement,
      messages: any[],
      format: ExportFormat,
      onProgress?: (current: number, total: number) => void
    ) => {
      if (!chatElement || messages.length === 0) {
        toast.error("Nenhuma mensagem para exportar");
        return;
      }

      setIsExporting(true);
      const frames: string[] = [];
      const fps = 30;
      const messageDuration = 1.5; // segundos por mensagem
      const framesPerMessage = Math.floor(fps * messageDuration);

      try {
        toast.info("Iniciando captura de frames...");

        // Capturar frame inicial (vazio)
        for (let i = 0; i < fps; i++) {
          const frame = await captureFrame(chatElement);
          frames.push(frame);
        }

        // Capturar frames para cada mensagem
        for (let i = 0; i < messages.length; i++) {
          onProgress?.(i + 1, messages.length);
          
          // Aguardar mensagem aparecer
          await new Promise((resolve) => setTimeout(resolve, 100));
          
          // Capturar frames dessa mensagem
          for (let f = 0; f < framesPerMessage; f++) {
            const frame = await captureFrame(chatElement);
            frames.push(frame);
          }
        }

        // Frame final (pause)
        for (let i = 0; i < fps * 2; i++) {
          const frame = await captureFrame(chatElement);
          frames.push(frame);
        }

        toast.info("Processando vídeo...");

        // Criar canvas para vídeo
        const canvas = document.createElement("canvas");
        canvas.width = format.width;
        canvas.height = format.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Não foi possível criar contexto canvas");
        }

        // Configurar MediaRecorder
        const stream = canvas.captureStream(fps);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp9",
          videoBitsPerSecond: 5000000, // 5 Mbps
        });

        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        await new Promise<void>((resolve, reject) => {
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `whatsapp-${Date.now()}.webm`;
            link.click();
            URL.revokeObjectURL(url);
            resolve();
          };

          mediaRecorder.onerror = reject;

          mediaRecorder.start();

          // Renderizar frames
          let frameIndex = 0;
          const renderFrame = () => {
            if (frameIndex >= frames.length) {
              mediaRecorder.stop();
              return;
            }

            const img = new Image();
            img.onload = () => {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // Centralizar imagem mantendo proporção
              const scale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
              );
              const x = (canvas.width - img.width * scale) / 2;
              const y = (canvas.height - img.height * scale) / 2;
              
              ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
              
              frameIndex++;
              setTimeout(renderFrame, 1000 / fps);
            };
            img.src = frames[frameIndex];
          };

          renderFrame();
        });

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
