import React from 'react'
import Video from "../img/video.png"
import Add from "../img/add_person.png"
import More from "../img/more.png"

import Messages from "./Messages"
import Input from "./Input"

const Chat = () => {
    return ( 
        <div className='chat'>
            <div className='chatInfo'>
                <span>Janet</span>
                <div className='chatIcons'>
                    <img src={Video} alt='' />
                    <img src={Add} alt='' />
                    <img src={More} alt='' />
                </div>
            </div>
                <Messages />
                <Input />
        </div>
    )
}

export default Chat