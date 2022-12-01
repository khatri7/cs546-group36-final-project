import { Box, Divider, Typography } from '@mui/material';
import React from 'react';
import Education from './Education';

// eslint-disable-next-line no-unused-vars
function Profile({ bio, work, education }) {
	return (
		<Box>
			<Box mb={2}>
				<Typography variant="h4" component="h2">
					Bio
				</Typography>
				<Typography>{bio}</Typography>
			</Box>
			<Divider />
			<Box mb={2}>
				<Typography variant="h4" component="h2">
					Work
				</Typography>
			</Box>
			<Divider />
			<Education education={education} />
		</Box>
	);
}

export default Profile;
