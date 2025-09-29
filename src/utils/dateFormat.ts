export function formatMessageTime(timestamp: string): string {
  return timestamp; // Users will input in HH:mm format
}

export function getDateSeparator(index: number, totalMessages: number): string | null {
  // Simple logic: first message shows "HOJE"
  if (index === 0) {
    return "HOJE";
  }
  return null;
}
