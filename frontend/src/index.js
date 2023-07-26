import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthControllerProvider } from './controllers/AuthController';
import { ChatControllerProvider } from './controllers/ChatController';
import { FriendControllerProvider } from './controllers/FriendController';
import { MessageControllerProvider } from './controllers/MessageController';
import { SocketControllerProvider } from './controllers/SocketController';
import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <AuthControllerProvider>
      <FriendControllerProvider>
        <ChatControllerProvider>
          <MessageControllerProvider>
            <SocketControllerProvider>
              <React.StrictMode>
                <App />
              </React.StrictMode>
            </SocketControllerProvider>
          </MessageControllerProvider>
        </ChatControllerProvider>
      </FriendControllerProvider>
    </AuthControllerProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
