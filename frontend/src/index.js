import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthContextProvider } from './contexts/AuthContext';
import { ChatContextProvider } from './contexts/ChatContext';
import { FriendContextProvider } from './contexts/FriendContext';
import { MessageContextProvider } from './contexts/MessageContext';
import { SocketContextProvider } from './contexts/SocketContext';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <FriendContextProvider>
          <ChatContextProvider>
            <MessageContextProvider>
              <SocketContextProvider>
                <App />
              </SocketContextProvider>
            </MessageContextProvider>
          </ChatContextProvider>
        </FriendContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
