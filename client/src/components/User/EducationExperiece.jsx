import React from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';

function EducationExperiece({ cardTitle, titleKey, subtitleKey, array = [] }) {
	return (
		<Card
			sx={{
				marginTop: 2,
			}}
			raised
		>
			<CardContent>
				<Typography variant="h4" component="h2">
					{cardTitle}
				</Typography>
				<Box>
					{array.map((item, index) => (
						<Box key={item._id}>
							<Box py={2}>
								<Typography variant="h5" component="h3">
									{item[titleKey]}
								</Typography>
								<Typography>{item[subtitleKey]}</Typography>
								<Typography
									sx={{
										fontSize: '14px',
										color: '#00000099',
									}}
								>
									{item.from} - {item.to || 'now'}
								</Typography>
							</Box>
							{index < array.length - 1 && <Divider />}
						</Box>
					))}
				</Box>
			</CardContent>
		</Card>
	);
}

export function Education({ education = [] }) {
	return (
		<EducationExperiece
			cardTitle="Education"
			titleKey="school"
			subtitleKey="course"
			array={education}
		/>
	);
}

export function Experience({ experiece = [] }) {
	return (
		<EducationExperiece
			cardTitle="Experience"
			titleKey="company"
			subtitleKey="title"
			array={experiece}
		/>
	);
}
