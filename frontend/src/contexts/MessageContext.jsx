import React, { createContext, useState } from "react";
import { MessagesContextType, MessagesProp, ProviderProp } from "../types";

const MessageContext = createContext(null);

export const MessageContextProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [queryNumber, setQueryNumber] = useState(0);

    return (
        <MessageContext.Provider value={{ messages, setMessages, loading, setLoading, queryNumber, setQueryNumber }}>
            {children}
        </MessageContext.Provider>
    );
};

export default MessageContext;
