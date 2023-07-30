import React, { createContext, useRef } from "react";
import { io } from "socket.io-client";
import { ProviderProp, SocketContextType } from "../types";
import AuthContext from "./AuthContext";

const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
    const socket = useRef(null);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
