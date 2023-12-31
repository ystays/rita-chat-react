import React, { useContext, useState } from 'react'
import Img from '../img/add_photo.png'
import Attach from '../img/attach_file.png'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, doc, serverTimestamp, updateDoc, Timestamp } from 'firebase/firestore';
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const Input = ({ inputToChat }) => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);

    const { currentUser} = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSendRTC = () => {
        if (!text) {
            return console.log("Please input some text.");
        }
        if (img) {
            // Send image
        } else {
            inputToChat({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
            })
        }
    }

    const handleSend = async () => {

        if (img) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                (error) => {
                  //TODO:Handle Error
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateDoc(doc(db, "chats", data.chatId), {
                      messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                        img: downloadURL,
                      }),
                    });
                  });
                }
            );
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                })
            })   
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId+".date"]: serverTimestamp(),
        })

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId+".date"]: serverTimestamp(),
        })


        setText("");
        setImg(null);
    }

    return ( 
        <div className='input'>
            <input type='text' placeholder='Type something...' onChange={e=>setText(e.target.value)} value={text}/>
            <div className='send'>
                <img src={Attach} alt='' />
                <input type='file' style={{display:"none"}} id='file' onChange={e=>setImg(e.target.files[0])}/>
                <label htmlFor='file'>
                    <img src={Img} alt='' />    
                </label> 
                <button onClick={handleSendRTC}>Send</button>
            </div>    
        </div>

    )
}

export default Input