import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function UploadProjectMedia({ projectMedia = [] }) {
	return (
		<Box>
			<Grid container>
				{[1, 2, 3, 4, 5].map((position) => (
					<Grid item xs={6} sx={{ p: 1 }}>
						{projectMedia[position] ? (
							<Box
								sx={{
									height: '150px',
								}}
							>
								<img
									src={projectMedia[position]}
									alt="project media"
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
									}}
								/>
							</Box>
						) : (
							<Button
								sx={{
									border: (theme) => `2px dashed ${theme.palette.primary.main}`,
									width: '100%',
									height: '150px',
								}}
							>
								<AddIcon color="primary" />
							</Button>
						)}
					</Grid>
				))}
			</Grid>
		</Box>
	);
}

export default UploadProjectMedia;
