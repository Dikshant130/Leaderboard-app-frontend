import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Leaderboard from './Leaderboard';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [claimedPoints, setClaimedPoints] = useState(null);
  const [newUserName, setNewUserName] = useState('');

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
      
      // Update claimed points in the state
      setClaimedPoints(response.data.points);

      // Update the selected user's total points in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === selectedUser.userId
            ? { ...user, totalPoints: user.totalPoints + response.data.points }
            : user
        )
      );
    } catch (error) {
      console.error('Error claiming points:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post('https://leaderboard-app-backend.onrender.com/add-user', { name: newUserName });
      setNewUserName('');
      setSelectedUser(null);

      const newUser = response.data;
      setUsers((prevUsers) => [...prevUsers, newUser]);

      // Re-fetch users to update leaderboard
      const fetchedUsers = await axios.get('https://leaderboard-app-backend.onrender.com/users');
      setUsers(fetchedUsers.data.sort((a, b) => b.totalPoints - a.totalPoints));
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div>
      <h2>User List</h2>
      <select value={selectedUser?.userId} onChange={(e) => handleUserSelect(users.find((user) => user.userId === e.target.value))}>
  <option value="">Select User</option>
  {users
    .filter((user, index, self) => self.findIndex(u => u.name === user.name) === index) // Remove duplicates by name
    .sort((a, b) => a.name.localeCompare(b.name))  // Sorting alphabetically by name
    .map((user) => (
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
      
      {/* Pass updated users and claimedPoints to Leaderboard */}
      <Leaderboard claimedPoints={claimedPoints} addUsers={users} />
    </div>
  );
};

export default UserList;
