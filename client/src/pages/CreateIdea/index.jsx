import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateIdeaForm from 'components/Idea/CreateIdea';

function CreateIdea() {
	const navigate = useNavigate();
	return (
		<CreateIdeaForm
			minHeight="60vh"
			onSuccessFn={(idea) => {
				navigate(`/ideas/${idea._id}`);
			}}
		/>
	);
}

export default CreateIdea;
