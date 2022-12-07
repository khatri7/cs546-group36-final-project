import SearchIdea from 'components/SearchIdea';
import useQuery from 'hooks/useQuery';
import React, { useState } from 'react';
import IdeasList from 'components/IdeasList';
import { Box, Typography } from '@mui/material';

function Ideas() {
	const [endpoint, setEndpoint] = useState('/ideas');

	const { data, error, loading } = useQuery(endpoint);

	const renderIdeasSection = () => {
		if (loading) return <Typography>Loading...</Typography>;
		if (error) return <Typography>{error}</Typography>;
		return <IdeasList ideasList={data.ideas || []} />;
	};

	return (
		<Box>
			<SearchIdea setEndpoint={setEndpoint} />
			<Box mt={2} py={2}>
				{renderIdeasSection()}
			</Box>
		</Box>
	);
}

export default Ideas;
