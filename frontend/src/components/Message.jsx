import React, { useState, useContext } from 'react';
import { FaSearch } from "react-icons/fa";
import { FaHamburger } from "react-icons/fa";
import Chats from './Chats';
import avatar from "../assets/avatar-food.png";
import AuthController from '../contexts/AuthContext';
import FriendController from '../contexts/FriendContext';

function Message({ setFriend, friend, toggleShow }) {
    const [text, setText] = useState("");
    const [err, setErr] = useState("");

    const isFriendPictureEmpty = friend?.displayPicture === "";

    const { state } = useContext(AuthController);
    const { friends, dispatch: friendDispatch } = useContext(FriendController);

    const { user } = state;
    const currentUser = user;

    const handleSearch = async (e) => {
        e.preventDefault();
        setText("");

        const res = await fetch(`http://localhost:5000/api/user/${text}`);
        const json = await res.json();

        if (!res.ok) {
            setErr(json.error);

            setTimeout(() => {
                setErr("");
            }, 3000);
        }

        if (res.ok) {
            setFriend(json);
        }
    };

    const handleAddFriend = async () => {
        const body = {
            userName: currentUser.userName,
            friendUsername: friend.userName,
            friendId: friend._id,
            userId: currentUser.id,
            friendImage: friend.displayPicture
        };

        const res = await fetch(`http://localhost:5000/api/friend/addFriend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentUser.token}`
            },
            body: JSON.stringify(body)
        });

        const json = await res.json();

        if (!res.ok) {
            setFriend(null);
            setErr(json.error);

            setTimeout(() => {
                setErr("");
            }, 3000);
        }

        if (res.ok) {
            setFriend(null);
            const data = {
                _id: json._id,
                friendDetails: json
            };

            friendDispatch({ type: "ADD", payload: data });
        }
    };

    return (
        <div className='mobile:px-3 px-5 bg-secondary h-[500px] overflow-auto'>
            <div className='sticky top-0 bg-secondary'>
                <div className='mb-6 sticky mt-1 flex justify-between items-center'>
                    <h2 className='text-2xl'>Messages</h2>
                    <FaHamburger className='mobile:block hidden' onClick={toggleShow} size={23} cursor="pointer" />
                </div>

                <form onSubmit={handleSearch}>
                    <p className='ml-1'>Find a User</p>

                    <div onClick={handleAddFriend} className='flex items-center gap-1 my-2 cursor-pointer'>
                        <img className='w-10 rounded-full object-cover' src={isFriendPictureEmpty ? avatar : friend?.displayPicture} alt="" />
                        <p>{ friend?.userName }</p>
                    </div>

                    {err && <div>{err}</div>}

                    <div className='bg-primary p-3 rounded-2xl'>
                        <input value={text} onChange={e => setText(e.target.value)} type="text" placeholder='Type their username' className='outline-none bg-transparent border-none' />
                        <button className='bg-secondary text-center rounded-lg p-1 active:scale-90 duration-300'>
                            <FaSearch size={20} className='inline' />Search
                        </button>
                    </div>
                </form>
            </div>

            <div className='flex flex-col gap-5 mt-4'>
                {friends.map(friend => (
                    <Chats key={friend._id} friend={friend} />
                ))}
            </div>
        </div>
    );
}

export default Message;
