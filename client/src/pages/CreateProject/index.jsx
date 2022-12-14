import React from 'react';
import CreateProjectForm from 'components/Project/CreateProject';
import { useNavigate } from 'react-router-dom';

function CreateProject() {
	const navigate = useNavigate();
	return (
		<CreateProjectForm
			minHeight="60vh"
			onSuccess={(project) => {
				navigate(`/projects/${project._id}`);
			}}
		/>
	);
}

export default CreateProject;
