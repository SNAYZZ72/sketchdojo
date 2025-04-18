export interface MessageProps {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
  avatarSrc?: string;
  images?: string[];
}

export interface ChatProps {
  id: string;
  title: string;
  messages: MessageProps[];
  createdAt: number;
  updatedAt: number;
} 