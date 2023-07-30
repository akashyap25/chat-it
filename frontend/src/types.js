export const Type = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
  };
  
  export const FriendType = {
    ADD: "ADD",
    FETCH: "FETCH",
  };
  
  export const AuthContextType = {
    state: {
      user: null,
    },
    dispatch: null,
  };
  
  export const ChatContextType = {
    chat: null,
    setChat: null,
    chatDiv: null,
    showChat: () => {},
    hideChat: () => {},
    render: false,
  };
  
  export const MessagesProp = {
    _id: "",
    senderId: "",
    receiverId: "",
    text: "",
    image: "",
    createdAt: "",
    audio: "",
  };
  
  export const MessagesContextType = {
    messages: [],
    setMessages: null,
    loading: false,
    setLoading: null,
    queryNumber: 0,
    setQueryNumber: null,
  };
  
  export const OnlineUserPtop = {
    socketId: "",
    userId: "",
  };
  
  export const SocketContextType = {
    socket: null,
  };
  