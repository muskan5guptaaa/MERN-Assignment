import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const Home = () => {
    const { user, logout } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await axios.get('/api/users', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setUsers(usersRes.data);

                const friendsRes = await axios.get('/api/users/friends', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setFriends(friendsRes.data);

                const recRes = await axios.get('/api/users/recommendations', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setRecommendations(recRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user]);

    const handleAddFriend = async (id) => {
        try {
            await axios.post(`/api/users/add/${id}`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Refresh data
            // Alternatively, update state locally
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnfriend = async (id) => {
        try {
            await axios.post(`/api/users/remove/${id}`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Refresh data
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter(u => u.username.includes(search));

    return (
        <div>
            <h1>Welcome, {user.username}</h1>
            <button onClick={logout}>Logout</button>
            
            <div>
                <h2>Search Users</h2>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
                <ul>
                    {filteredUsers.map(u => (
                        <li key={u._id}>
                            {u.username}
                            <button onClick={() => handleAddFriend(u._id)}>Add Friend</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Your Friends</h2>
                <ul>
                    {friends.map(f => (
                        <li key={f._id}>
                            {f.username}
                            <button onClick={() => handleUnfriend(f._id)}>Unfriend</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Recommended Friends</h2>
                <ul>
                    {recommendations.map(rec => (
                        <li key={rec.user._id}>
                            {rec.user.username} - {rec.mutualFriendsCount} Mutual Friends
                            <button onClick={() => handleAddFriend(rec.user._id)}>Add Friend</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;
