import { MoreVertOutlined, OpenInNewOutlined } from '@mui/icons-material';
import {
	Card,
	CardContent,
	CardHeader,
	Chip,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @typedef {Object} Project
 * @property {ObjectId} _id
 * @property {string} name
 * @property {string} description
 * @property {Date} createdAt
 * @property {string[]} technologies
 * @property {Object} user
 * @property {ObjectId[]} savedBy
 * @property {ObjectId[]} likes
 * @property {Object} comments
 */

/**
 * @typedef {Object} props
 * @property {Project} project
 * @property {Boolean} isOwner
 * @property {number} gridCols
 */

/**
 * @param {props} props
 */
function IdeaCard({ idea, isOwner = false, gridCols = 4 }) {
	const navigate = useNavigate();
	const [anchorElIdea, setAnchorElIdea] = useState(null);

	const handleOpenIdeaMenu = (event) => {
		setAnchorElIdea(event.currentTarget);
	};

	const handleCloseIdeaMenu = () => {
		setAnchorElIdea(null);
	};
	return (
		<Grid item xs={gridCols}>
			<Card raised sx={{ height: '100%' }}>
				<CardHeader
					title={idea.name}
					subheader={`@${idea.owner.username}`}
					action={
						<Stack direction="row" gap={1}>
							<IconButton
								onClick={() => {
									navigate(`/idea/${idea._id}`);
								}}
								aria-label="open idea"
							>
								<OpenInNewOutlined />
							</IconButton>
							{isOwner && (
								<>
									<IconButton aria-label="options" onClick={handleOpenIdeaMenu}>
										<MoreVertOutlined />
									</IconButton>
									<Menu
										sx={{ mt: '2rem' }}
										id="menu-appbar"
										anchorEl={anchorElIdea}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										keepMounted
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										open={Boolean(anchorElIdea)}
										onClose={handleCloseIdeaMenu}
									>
										<MenuItem
											sx={{ alignItems: 'center' }}
											onClick={handleCloseIdeaMenu}
										>
											<Typography textAlign="center">Delete</Typography>
										</MenuItem>
									</Menu>
								</>
							)}
						</Stack>
					}
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						{idea.description}
					</Typography>
					<Stack direction="row" gap={1} mt={1}>
						{idea.technologies.slice(0, 4).map((tech) => (
							<Chip label={tech} key={tech} variant="outlined" />
						))}
						{idea.technologies.length > 4 && (
							<Chip
								label={`+${idea.technologies.length - 1}`}
								variant="outlined"
							/>
						)}
					</Stack>
				</CardContent>
			</Card>
		</Grid>
	);
}

export default IdeaCard;
