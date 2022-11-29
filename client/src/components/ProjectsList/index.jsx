import { Grid, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';

function ProjectsList({ projectsList = [] }) {
	const user = useSelector((state) => state.user);
	if (projectsList.length === 0) return <Typography>No projects</Typography>;
	return (
		<Grid container spacing={3}>
			{projectsList.map((project) => (
				<ProjectCard
					project={project}
					key={project._id}
					isOwner={Boolean(user?._id && user._id === project.owner._id)}
				/>
			))}
		</Grid>
	);
}

export default ProjectsList;
