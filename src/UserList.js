import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [claimedPoints, setClaimedPoints] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://leaderboard-app-backend.onrender.com/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleClaimPoints = async () => {
    try {
      const response = await axios.post('https://leaderboard-app-backend.onrender.com/claim-points', { userId: selectedUser.userId });
      setClaimedPoints(response.data.points);
    } catch (error) {
      console.error('Error claiming points:', error);
    }
  };

  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = async () => {
  try {
    const response = await axios.post('https://leaderboard-app-backend.onrender.com/add-user', { name: newUserName });
    setNewUserName('');
    setSelectedUser(null);

    const newUser = response.data; 
    setUsers((prevUsers) => [...prevUsers, newUser]);

  } catch (error) {
    console.error('Error adding user:', error);
  }
};

  return (
    <div>
      <h2>User List</h2>
      <select value={selectedUser?.userId} onChange={(e) => handleUserSelect(users.find((user) => user.userId === e.target.value))}>
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.userId} value={user.userId}>
            {user.name}
          </option>
        ))}
      </select>
      <button disabled={!selectedUser} onClick={handleClaimPoints}>
        Claim Points
      </button>
      {claimedPoints && <p>Claimed Points: {claimedPoints}</p>}
      <h3>Add User</h3>
      <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
};

export default UserList;
