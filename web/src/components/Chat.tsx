import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ChatMessage, AiResponse } from '../types';

const STORAGE_KEY = 'ai-frontend-chat-history-v1';
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8787';

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveHistory(messages: ChatMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

const Chat: React.FC = () => {
  const [messages, setMessages] = React.useState<ChatMessage[]>(loadHistory);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [model, setModel] = React.useState('gpt-4o-mini');

  React.useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  async function callAi(prompt: string): Promise<AiResponse> {
    const resp = await fetch(`${API_BASE}/api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model })
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || `HTTP ${resp.status}`);
    }
    return resp.json();
  }

  const onSend = async (text: string) => {
    setError(null);
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      createdAt: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const ai = await callAi(text);
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: ai.content ?? '(no content)',
        createdAt: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setMessages([]);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="card" role="region" aria-label="Chat panel">
      <div className="toolbar">
        <h2>Chat</h2>
        <div className="actions">
          <select
            className="button"
            value={model}
            onChange={e => setModel(e.target.value)}
            aria-label="Model"
          >
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="gpt-4.1-mini">gpt-4.1-mini</option>
            <option value="gpt-4o">gpt-4o</option>
          </select>
          <button className="button ghost" onClick={onClear} aria-label="Clear history">
            Clear
          </button>
        </div>
      </div>

      <MessageList messages={messages} />

      <div className="input-wrap">
        <MessageInput disabled={loading} onSubmit={onSend} />
      </div>

      <div className="status">
        {loading && <>Sending to AI…</>}
        {error && <span className="error">Error: {error}</span>}
        {!loading && !error && <>Ready</>}
      </div>
    </div>
  );
};

export default Chat;
