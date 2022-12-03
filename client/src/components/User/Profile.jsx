import { Box, Typography, Card, CardContent } from '@mui/material';
import React from 'react';
import { Education, Experience } from './EducationExperiece';

function Profile({ bio = '', experience = [], education = [] }) {
	return (
		<Box>
			<Card raised>
				<CardContent>
					<Typography variant="h4" component="h2">
						Bio
					</Typography>
					<Box>{bio}</Box>
				</CardContent>
			</Card>
			<Experience experiece={experience} />
			<Education education={education} />
		</Box>
	);
}

export default Profile;
