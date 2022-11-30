import { Typography } from '@mui/material';
import ProjectsList from 'components/ProjectsList';
import useQuery from 'hooks/useQuery';
import React from 'react';

function SavedProjects({ username }) {
	const { data, loading, error } = useQuery(
		`/users/${username}/saved-projects`
	);

	if (error) return <Typography>{error}</Typography>;

	if (loading) return <Typography>Loading...</Typography>;

	const { projects } = data;

	if (!projects) return <Typography>Error getting the projects</Typography>;

	if (projects.length === 0) return <Typography>No projects</Typography>;

	return <ProjectsList projectsList={projects} projectsPerRow={2} />;
}

export default SavedProjects;
