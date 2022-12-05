import React from 'react';
import { useParams } from 'react-router-dom';

function Idea() {
	const { ideaId } = useParams();
	// checkout pages/user/index.jsx to see how data is being loaded
	return <div>{ideaId}</div>;
}

export default Idea;
