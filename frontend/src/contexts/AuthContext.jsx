import { createContext, useReducer, useEffect } from "react";
import { Type } from "../types";

const AuthContext = createContext(null);

const authReducer = (state, action) => {
    switch (action.type) {
        case Type.LOGOUT:
            return {
                user: null
            };
        case Type.login:
            return {
                user: action.payload
            };
        default:
            return state;
    }
};

const initialState = {
    user: null
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            dispatch({ type: Type.login, payload: JSON.parse(user) });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
