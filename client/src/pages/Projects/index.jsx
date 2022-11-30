import SearchProject from 'components/SearchProject';
import useQuery from 'hooks/useQuery';
import React, { useState } from 'react';
import ProjectsList from 'components/ProjectsList';
import { Box, Typography } from '@mui/material';

function Projects() {
	const [endpoint, setEndpoint] = useState('/projects');

	const { data, error, loading } = useQuery(endpoint);

	const renderProjectsSection = () => {
		if (loading) return <Typography>Loading...</Typography>;
		if (error) return <Typography>{error}</Typography>;
		return <ProjectsList projectsList={data.projects || []} />;
	};

	return (
		<Box>
			<SearchProject setEndpoint={setEndpoint} />
			<Box mt={2} py={2}>
				{renderProjectsSection()}
			</Box>
		</Box>
	);
}

export default Projects;
