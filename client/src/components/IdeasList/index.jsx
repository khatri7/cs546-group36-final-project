import { Grid, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import IdeaCard from './IdeaCard';

function IdeasList({ ideasList = [], ideasPerRow = 3 }) {
	const user = useSelector((state) => state.user);
	if (ideasList.length === 0) return <Typography>No ideas</Typography>;
	return (
		<Grid container spacing={3}>
			{ideasList.map((idea) => (
				<IdeaCard
					idea={idea}
					key={idea._id}
					isOwner={Boolean(user?._id && user._id === idea.owner._id)}
					gridCols={12 / ideasPerRow}
				/>
			))}
		</Grid>
	);
}

export default IdeasList;
