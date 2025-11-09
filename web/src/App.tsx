import React from 'react';
import Chat from './components/Chat';

export default function App() {
  return (
    <div className="app-shell">
      <div className="header">
        <h1 style={{ margin: 0 }}>Servimatt Assessmet</h1>
      </div>
      <Chat />
    </div>
  );
}
