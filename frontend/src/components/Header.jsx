import React, { useContext } from "react";
import { IoIosArrowBack } from "react-icons/io";
import videocall from "../assets/cam.png";
import more from "../assets/more.png";
import AuthController from "../contexts/AuthContext";
import ChatController from "../contexts/ChatContext";
import { User } from "../types";

function Header() {
    const { state } = useContext(AuthController);
    const { chat, hideChat } = useContext(ChatController);

    const { user } = state;
    const currentUser = user;

    const isMyUsername = chat?.friendDetails.friendUsername === currentUser.userName;

    return (
        <div className='bg-[#3e3c61] flex justify-between items-center h-10 px-2'>
            <IoIosArrowBack onClick={hideChat} cursor={"pointer"} className="mobile:block hidden" />
            <p>{isMyUsername ? chat.friendDetails.userName : chat?.friendDetails.friendUsername}</p>

            <div className='flex items-center'>
                <img className='w-7' src={videocall} alt="Video Call" />
                <img className='w-7' src={more} alt="More Options" />
                {/* Add more icons here if needed */}
            </div>
        </div>
    );
}

export default Header;
