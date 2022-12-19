import useQuery from 'hooks/useQuery';
import { React, useState } from 'react';
import UsersList from 'components/Hiring/UsersList';
import { Box, Typography } from '@mui/material';
import SearchUser from 'components/SearchUser';

function Hiring() {
	const [endpoint, setEndpoint] = useState('/hiring');
	const { data, error, loading } = useQuery(endpoint);

	const renderHiringSection = () => {
		if (loading) return <Typography>Loading...</Typography>;
		if (error) return <Typography>{error}</Typography>;
		return <UsersList usersList={data.users || []} />;
	};
	return (
		<Box>
			<SearchUser setEndpoint={setEndpoint} />
			<Box mt={2} py={2}>
				{renderHiringSection()}
			</Box>
		</Box>
	);
}

export default Hiring;
