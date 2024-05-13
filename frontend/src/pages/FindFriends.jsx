import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setHeaders } from '../api/utils';
import { fetchFriends, fetchFriendSchedule, fetchSchedule } from '../api/users';

const FindFriends = () => {
    const [username, setUsername] = useState('');
    const [friends, setFriends] = useState([]);
    const [message, setMessage] = useState('');

    const rootURL = 'http://localhost:3010'; // Define the root URL of your API

    // Function to fetch friends
    const fetchFriend = async () => {
        try {
            const token = localStorage.getItem('app-token');
            if (!token) {
                setMessage('No token found. Please log in.');
                return;
            } else {
                setMessage('proceed!!!!!]');
            }
            
            const response = await axios.get(`${rootURL}/user/friends`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.friends) {
                setFriends(response.data.friends);
            } else {
                setMessage('Unexpected response from the server, please try again.');
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.error);
            } else {
                setMessage('Failed to fetch friends.');
            }
        }
    };

    // Fetch friends when the component loads
    useEffect(() => {
        fetchFriends();
    }, []);

    const handleAddFriend = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('app-token');
            const response = await axios.post(`${rootURL}/addFriend`, { friendUsername: username }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.friends) {
                setFriends(response.data.friends);  // Update the friends list with the new array
                setMessage('Friend added successfully!');
            } else {
                setMessage('Unexpected response from the server, please try again.');
            }
            setUsername('');  // Clear the input field
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.error);
            } else {
                setMessage('Failed to add friend.');
            }
        }
    };    

    return (
        <div>
            <form onSubmit={handleAddFriend}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a friend's username"
                    required
                />
                <button type="submit">Add Friend</button>
            </form>
            
            {message && <p>{message}</p>}

            <div>
                <h3>Your Friends:</h3>
                {friends.length > 0 ? (
                    friends.map((friend, index) => <p key={index}>{friend}</p>)
                ) : (
                    <p>No friends added yet.</p>
                )}
            </div>
        </div>
    );
};

export default FindFriends;
