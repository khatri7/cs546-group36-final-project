import { Box } from '@mui/material';
import React from 'react';
import Bio from './Bio';
import { Education, Experience } from './EducationExperience';

function Profile({
	username,
	dob,
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
			<Experience
				username={username}
				dob={dob}
				experiece={experience}
				isCurrentUserProfile={isCurrentUserProfile}
				handleUpdateUser={handleUpdateUser}
			/>
			<Education
				username={username}
				dob={dob}
				education={education}
				isCurrentUserProfile={isCurrentUserProfile}
				handleUpdateUser={handleUpdateUser}
			/>
		</Box>
	);
}

export default Profile;
