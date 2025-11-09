export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number; // epoch ms
}

export interface AiResponse {
  model: string;
  content: string;
}
