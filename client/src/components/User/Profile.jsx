import { Box } from '@mui/material';
import React from 'react';
import Bio from './Bio';
import { Education, Experience } from './EducationExperiece';

function Profile({
	username,
	bio = '',
	experience = [],
	education = [],
	handleUpdateUser,
	isCurrentUserProfile,
}) {
	return (
		<Box>
			<Bio
				username={username}
				bio={bio}
				handleUpdateUser={handleUpdateUser}
				isCurrentUserProfile={isCurrentUserProfile}
			/>
			<Experience experiece={experience} />
			<Education education={education} />
		</Box>
	);
}

export default Profile;
