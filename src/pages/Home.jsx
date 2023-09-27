import React from 'react';
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const Home = ({ socket }) => {
    return (
        <div className='home'>
            <div className='container'>
                <Sidebar />
                <Chat socket={socket}/>
            </div>
        </div>
    )
}

export default Home