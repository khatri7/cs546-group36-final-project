import { Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';

function ProjectsList({
	projectsList = [],
	projectsPerRow = 3,
	removeProjectOnUnsave = false,
}) {
	const user = useSelector((state) => state.user);
	const [projects, setProjects] = useState(projectsList);
	useEffect(() => {
		setProjects(projectsList);
	}, [projectsList]);
	if (projects.length === 0) return <Typography>No projects</Typography>;
	const removeProject = (projectId) => {
		setProjects(projects.filter((project) => project._id !== projectId));
	};
	return (
		<Grid container spacing={3}>
			{projects.map((project) => (
				<ProjectCard
					project={project}
					key={project._id}
					isOwner={Boolean(user?._id && user._id === project.owner._id)}
					gridCols={12 / projectsPerRow}
					removeProject={removeProject}
					removeProjectOnUnsave={removeProjectOnUnsave}
				/>
			))}
		</Grid>
	);
}

export default ProjectsList;
