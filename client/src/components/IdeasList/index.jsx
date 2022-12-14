import { Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import IdeaCard from './IdeaCard';

function IdeasList({ ideasList = [], ideasPerRow = 3 }) {
	const user = useSelector((state) => state.user);
	const [ideas, setIdeas] = useState(ideasList);
	useEffect(() => {
		setIdeas(ideasList);
	}, [ideasList]);
	if (ideas.length === 0) return <Typography>No ideas</Typography>;
	const removeIdea = (ideaId) => {
		setIdeas(ideas.filter((idea) => idea._id !== ideaId));
	};
	return (
		<Grid container spacing={3}>
			{ideas.map((idea) => (
				<IdeaCard
					idea={idea}
					key={idea._id}
					isOwner={Boolean(user?._id && user._id === idea.owner._id)}
					gridCols={12 / ideasPerRow}
					removeIdea={removeIdea}
				/>
			))}
		</Grid>
	);
}

export default IdeasList;
