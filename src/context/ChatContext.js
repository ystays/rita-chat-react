import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from "../firebase";


export const ChatContext = createContext();


export const ChatContextProvider = ({children}) => {
    const { currentUser } = useContext(AuthContext);

    const INITIAL_STATE = {
        chatId: null,
        user: {}
    }

    const chatReducer = {

    }

    return (
        <ChatContext.Provider value={{currentUser}}>
            {children}
        </ChatContext.Provider>
    )
}