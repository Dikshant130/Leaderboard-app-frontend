import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [claimedPoints, setClaimedPoints] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://leaderboard-app-backend.onrender.com/users');
        setUsers(response.data.sort((a, b) => b.totalPoints - a.totalPoints));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [setClaimedPoints]);

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.userId}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;