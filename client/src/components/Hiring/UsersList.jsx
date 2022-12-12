import { Typography } from '@mui/material';
import { React } from 'react';
import UserCard from './UserCard';

function UsersList({ usersList = [] }) {
	if (usersList.length === 0) return <Typography>No Users</Typography>;
	return usersList.map((user) => <UserCard key="user._id" user={user} />);
}
export default UsersList;
