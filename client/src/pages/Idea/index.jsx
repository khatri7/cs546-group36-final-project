import React from 'react';
import useQuery from 'hooks/useQuery';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import IdeaInfo from 'components/Idea/IdeaInfo';

function Idea() {
	const { ideaId } = useParams();
	const { data, loading, error } = useQuery(`/ideas/${ideaId}`);
	if (error) return <Typography>{error}</Typography>;
	if (loading) return <Typography>Loading...</Typography>;
	const { idea } = data;
	if (!idea) return <Typography>Error getting user</Typography>;

	// checkout pages/user/index.jsx to see how data is being loaded
	return (
		<div>
			<IdeaInfo idea={idea} />
		</div>
	);
}

export default Idea;
