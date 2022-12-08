import { Box, Chip, Typography } from '@mui/material';
import React from 'react';

function Technologies({ technologies }) {
	return (
		<Box>
			{technologies.map((technology) => {
				return (
					<div key={technology}>
						<Typography variant="h8" component="p">
							Technologies Used:
						</Typography>
						<Chip label={technology} />
					</div>
				);
			})}
		</Box>
	);
}
export default Technologies;
