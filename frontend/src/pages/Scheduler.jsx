import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleSelector from 'react-schedule-selector';
import { createSchedule, fetchFriends, fetchFriendSchedule } from '../api/users';

const Scheduler = () => {
    const [schedule, setSchedule] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadFriends = async () => {
            try {
                const friends = await fetchFriends();
                setFriendsList(friends || []);
            } catch (error) {
                console.error('Failed to fetch friends:', error);
                setFriendsList([]);  // Ensure state is always an array even on error.
            }
        };
        loadFriends();
    }, []);

    const handleFriendSelection = (friendId) => {
        const newSelectedFriends = selectedFriends.includes(friendId)
            ? selectedFriends.filter(id => id !== friendId)
            : [...selectedFriends, friendId];
        setSelectedFriends(newSelectedFriends);
        updateScheduleWithFriends(newSelectedFriends);
    };

    const updateScheduleWithFriends = async (friendIds) => {
        if (friendIds.length > 0) {
            const friendsSchedules = await Promise.all(
                friendIds.map(id => fetchFriendSchedule(id))
            );
            const combinedSchedules = [].concat.apply([], friendsSchedules);
            setSchedule([...new Set([...schedule, ...combinedSchedules])]);
        } else {
            setSchedule([]);
        }
    };

    const handleChange = (newSchedule) => {
        setSchedule(newSchedule || []);
    };

    const handleSubmit = async () => {
        try {
            await createSchedule(schedule);
            alert('Schedule submitted successfully!');
            navigate('/dashboard'); // Redirect after submission, adjust as needed
        } catch (error) {
            alert('Failed to submit schedule: ' + error.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
            <div>
                {friendsList.length > 0 ? friendsList.map(friend => (
                    <div key={friend.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedFriends.includes(friend.id)}
                                onChange={() => handleFriendSelection(friend.id)}
                            />
                            {friend.name}
                        </label>
                    </div>
                )) : <p>No friends to display.</p>}
            </div>

            <div>
                <ScheduleSelector
                    selection={schedule}
                    numDays={1}
                    minTime={8}
                    maxTime={22}
                    hourlyChunks={1}
                    onChange={handleChange}
                />
                <button type="submit" onClick={handleSubmit}>Submit Schedule</button>
            </div>

            <div>
                <h3>Schedule Timestamps</h3>
                <ul>
                    {schedule.length > 0 ? schedule.map((time, index) => (
                        <li key={index}>{time.toString()}</li>
                    )) : <li>No schedule times selected.</li>}
                </ul>
            </div>
        </div>
    );
};

export default Scheduler;
