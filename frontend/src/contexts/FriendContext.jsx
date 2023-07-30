import React, { createContext, useReducer } from "react";
import { ProviderProp, FriendActionProp, FriendContextType, FriendStateProp, FriendType, Friend } from "../types";

const FriendContext = createContext(null);

const friendReducer = (state, action) => {
    switch (action.type) {
        case FriendType.ADD:
            return {
                friends: [...state.friends, action.payload]
            };

        case FriendType.FETCH:
            return {
                friends: action.payload
            };

        default:
            return state;
    }
};

const initialState = {
    friends: []
};

export const FriendContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(friendReducer, initialState);

    const { friends } = state;

    return (
        <FriendContext.Provider value={{ friends, dispatch }}>
            {children}
        </FriendContext.Provider>
    );
};

export default FriendContext;
