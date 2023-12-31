import React, { useState, useEffect, useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { db } from "../firebase";
import { doc, onSnapshot } from 'firebase/firestore'
import Message from './Message';

const Messages = ({ chatToMsg }) => {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);

    // useEffect(() => {
    //     const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
    //         doc.exists() && setMessages(doc.data().messages);            
    //     });

    //     return () => {
    //         unSub();
    //     };
    // }, [data.chatId])

    if (chatToMsg !== "") {
        setMessages(oldMessages => [...oldMessages, JSON.parse(chatToMsg)] );
        chatToMsg = "";
    }
    else {
        console.log("empty msg: ", messages);
    }

    // useEffect(() => {

    //     return () => { 
    //         if (chatToMsg) {
    //             setMessages(oldMessages => [...oldMessages, JSON.parse(chatToMsg)] );
    //         }
    //     };
    // }, [chatToMsg])

    return (
        <div className='messages'>
            {messages.map(m => {
                return <Message message={m} key={m.id} />
            })}
        </div>
    )
}

export default Messages