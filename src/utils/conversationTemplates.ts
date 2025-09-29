import { Conversation } from "@/types/chat";

export const templates: Record<string, Conversation> = {
  vendas: {
    id: "template-vendas",
    contact: {
      name: "Cliente Interessado",
      status: "online",
    },
    user: {
      name: "Você",
    },
    messages: [
      {
        id: "1",
        text: "Olá! Vi seu produto e gostei muito. Ainda tem disponível?",
        sender: "contact",
        timestamp: "10:30",
        status: "read",
      },
      {
        id: "2",
        text: "Oi! Sim, temos em estoque. Qual modelo você quer?",
        sender: "own",
        timestamp: "10:31",
        status: "read",
      },
      {
        id: "3",
        text: "O modelo premium. Qual o preço?",
        sender: "contact",
        timestamp: "10:32",
        status: "read",
      },
      {
        id: "4",
        text: "R$ 299,90 à vista ou 3x sem juros!",
        sender: "own",
        timestamp: "10:33",
        status: "read",
      },
      {
        id: "5",
        text: "Perfeito! Quero comprar 😊",
        sender: "contact",
        timestamp: "10:35",
        status: "read",
      },
    ],
    showWatermark: true,
  },
  suporte: {
    id: "template-suporte",
    contact: {
      name: "Suporte Técnico",
      status: "disponível",
    },
    user: {
      name: "Você",
    },
    messages: [
      {
        id: "1",
        text: "Olá! Estou com um problema no aplicativo",
        sender: "own",
        timestamp: "14:20",
        status: "read",
      },
      {
        id: "2",
        text: "Oi! Descreva o problema para que eu possa ajudar.",
        sender: "contact",
        timestamp: "14:21",
        status: "read",
      },
      {
        id: "3",
        text: "Não consigo fazer login",
        sender: "own",
        timestamp: "14:22",
        status: "read",
      },
      {
        id: "4",
        text: "Entendi. Vou verificar sua conta. Um momento...",
        sender: "contact",
        timestamp: "14:23",
        status: "read",
      },
      {
        id: "5",
        text: "Pronto! Problema resolvido. Tente fazer login novamente.",
        sender: "contact",
        timestamp: "14:25",
        status: "read",
      },
    ],
    showWatermark: true,
  },
  convite: {
    id: "template-convite",
    contact: {
      name: "Melhor Amigo",
      status: "online",
    },
    user: {
      name: "Você",
    },
    messages: [
      {
        id: "1",
        text: "E aí, tá fazendo o quê amanhã?",
        sender: "own",
        timestamp: "19:15",
        status: "read",
      },
      {
        id: "2",
        text: "Nada de especial, por quê?",
        sender: "contact",
        timestamp: "19:16",
        status: "read",
      },
      {
        id: "3",
        text: "Vamos no churrasco lá em casa? 🍖",
        sender: "own",
        timestamp: "19:17",
        status: "read",
      },
      {
        id: "4",
        text: "Opa! Que horas?",
        sender: "contact",
        timestamp: "19:18",
        status: "read",
      },
      {
        id: "5",
        text: "A partir das 16h. Cola lá!",
        sender: "own",
        timestamp: "19:19",
        status: "delivered",
      },
    ],
    showWatermark: true,
  },
};
