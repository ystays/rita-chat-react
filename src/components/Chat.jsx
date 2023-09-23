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
                    {/* <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet" /> */}
                    {/* <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script> */}
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
                    <div id="buttons" class="ctrl__buttons">
                        <button class="mdc-button mdc-button--raised" id="readyBtn">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">phone_enabled</i>
                            <span class="mdc-button__label">Go online</span>
                        </button>
                        <button class="mdc-button mdc-button--raised" disable id="connectBtn">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">group</i>
                            <span class="mdc-button__label">Start call</span>
                        </button>
                        <button class="mdc-button mdc-button--raised" disabled id="hangupBtn">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">close</i>
                            <span class="mdc-button__label">Hangup</span>
                        </button>
                        <button class="mdc-button mdc-button--raised" id="videoCallBtn">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">video_call</i>
                            {/* <span class="mdc-button__label">Video call</span> */}
                        </button>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
                        <button class="mdc-button mdc-button--raised" id="addPersonBtn">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">person_add</i>
                            {/* <span class="mdc-button__label"></span> */}
                        </button>
                        <button class="mdc-button mdc-button--raised" id="MoreBtn">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">more_horiz</i>
                            {/* <span class="mdc-button__label">More</span> */}
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

export default Chat