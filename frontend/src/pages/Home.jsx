import React, { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import ChatBox from '../components/ChatBox';
import SideBar from '../components/SideBar';
import AuthContext from '../contexts/AuthContext';
import ChatContext from '../contexts/ChatContext';
import MessageContext from '../contexts/MessageContext';
import { User } from '../types';

function Home() {
    const [display, setDisplay] = useState(true);
    const socket = React.useRef(null);
    const { setMessages } = useContext(MessageContext);
    const { render } = useContext(ChatContext);
    const [onlineUser, setOnlineUser] = useState([]);
    const { state } = useContext(AuthContext);
    const { user } = state;
    
    // Ensure user is not null before proceeding
    const currentUser = user ? user : null;

    useEffect(() => {
        // Assuming frontend is running on localhost:3000
        socket.current = io("http://localhost:3000");
        if (currentUser) {
            socket.current.emit("add-new-user", currentUser.id);
        }
        socket.current.on("get-online-users", (activeUsers) => {
            setOnlineUser(activeUsers);
        });
    }, [currentUser]);

    useEffect(() => {
        socket.current.on("receive-message", (data) => {
            console.log(data);
            setMessages((prev) => [...prev, data]);
        });

        socket.current.on("is-online", (data) => {
            console.log(data);
        });

        if (window.innerWidth <= 1200) {
            setDisplay(false);
        }

        window.addEventListener("resize", () => {
            if (window.innerWidth <= 1200) {
                setDisplay(false);
            }
        });
    }, []);

    return (
        <div className='flex justify-center items-center h-screen'>
            {window.innerWidth > 1200 ? (
                <div className='flex justify-center w-[90%] h-[500px]'>
                    <SideBar />
                    <ChatBox socket={socket} />
                </div>
            ) : (
                <>
                    {render ? (
                        <SideBar />
                    ) : (
                        <div className='flex justify-center w-full h-[500px]'>
                            <ChatBox socket={socket} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;
