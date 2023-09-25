import React, { useContext } from 'react';
// import Video from "../img/video.png";
// import Add from "../img/add_person.png";
// import More from "../img/more.png";

import Messages from "./Messages";
import Input from "./Input";

import { ChatContext } from "../context/ChatContext";

const Chat = () => {
    const { data } = useContext(ChatContext);

    return ( 
        <div className='chat'>
            <div className='chatInfo'>
                <span>{data.user?.displayName}</span>
                <div className='chatIcons'>
                    {/* <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet" /> */}
                    {/* <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script> */}
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
                    <div id="buttons" className="ctrl__buttons">
                        <button className="mdc-button mdc-button--raised" id="readyBtn">
                            {/* <i className="material-icons mdc-button__icon" aria-hidden="true">phone_enabled</i> */}
                            <i className="material-icons mdc-button__icon" aria-hidden="true">connect_without_contact</i>
                            {/* <span className="mdc-button__label">Go online</span> */}
                        </button>
                        <button className="mdc-button mdc-button--raised" disabled id="connectBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">call</i>
                            {/* <span className="mdc-button__label">Start chat</span> */}
                        </button>
                        <button className="mdc-button mdc-button--raised" disabled id="hangupBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">call_end</i>
                            {/* <span className="mdc-button__label">Hangup</span> */}
                        </button>
                        <button className="mdc-button mdc-button--raised" id="videoCallBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">video_call</i>
                            {/* <span className="mdc-button__label">Video call</span> */}
                        </button>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
                        <button className="mdc-button mdc-button--raised" id="addPersonBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">person_add</i>
                            {/* <span className="mdc-button__label"></span> */}
                        </button>
                        <button className="mdc-button mdc-button--raised" id="MoreBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">more_horiz</i>
                            {/* <span className="mdc-button__label">More</span> */}
                        </button>
                    </div>

                    {/* <img src={Video} alt='' />
                    <img src={Add} alt='' />
                    <img src={More} alt='' /> */}
                </div>
            </div>
                <Messages />
                <Input />
        </div>
    )
}

export default Chat;