import React from 'react';
import { ChatMessage } from '../types';

interface Props {
  messages: ChatMessage[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
  return (
    <div className="history" aria-live="polite">
      {messages.length === 0 && (
        <div className="status">No messages yet.</div>
      )}
      {messages.map(m => (
        <div className="message" key={m.id}>
          <div className="role">{m.role}</div>
          <div className={`bubble ${m.role === 'assistant' ? 'assistant' : ''}`}>
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
