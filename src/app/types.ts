export type Lang = "en" | "fr";
export type Theme = "dark" | "light";

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  isThinking?: boolean;
  source?: string;
}
