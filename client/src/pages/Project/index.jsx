import React from 'react';
import { useParams } from 'react-router-dom';

function Project() {
	const { projectId } = useParams();
	// checkout pages/user/index.jsx to see how data is being loaded
	return <div>{projectId}</div>;
}

export default Project;
