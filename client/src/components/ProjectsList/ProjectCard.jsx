import { MoreVertOutlined, OpenInNewOutlined } from '@mui/icons-material';
import {
	Card,
	CardContent,
	CardHeader,
	CardMedia,
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
 * @property {string} github
 * @property {string} deploymentLink
 * @property {Date} createdAt
 * @property {string[]} media
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
function ProjectCard({ project, isOwner = false, gridCols = 4 }) {
	const navigate = useNavigate();
	const [anchorElProject, setAnchorElProject] = useState(null);

	const handleOpenProjectMenu = (event) => {
		setAnchorElProject(event.currentTarget);
	};

	const handleCloseProjectMenu = () => {
		setAnchorElProject(null);
	};
	return (
		<Grid item xs={gridCols}>
			<Card raised sx={{ height: '100%' }}>
				<CardHeader
					title={project.name}
					subheader={`@${project.owner.username}`}
					action={
						<Stack direction="row" gap={1}>
							<IconButton
								onClick={() => {
									navigate(`/projects/${project._id}`);
								}}
								aria-label="open project"
							>
								<OpenInNewOutlined />
							</IconButton>
							{isOwner && (
								<>
									<IconButton
										aria-label="options"
										onClick={handleOpenProjectMenu}
									>
										<MoreVertOutlined />
									</IconButton>
									<Menu
										sx={{ mt: '2rem' }}
										id="menu-appbar"
										anchorEl={anchorElProject}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										keepMounted
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										open={Boolean(anchorElProject)}
										onClose={handleCloseProjectMenu}
									>
										<MenuItem
											sx={{ alignItems: 'center' }}
											onClick={handleCloseProjectMenu}
										>
											<Typography textAlign="center">Delete</Typography>
										</MenuItem>
									</Menu>
								</>
							)}
						</Stack>
					}
				/>
				<CardMedia
					component="img"
					image="https://www.wikihow.com/images/thumb/d/d5/Be-Random-Step-8.jpg/v4-460px-Be-Random-Step-8.jpg.webp"
					alt={project.name}
					height={180}
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						{project.description}
					</Typography>
					<Stack direction="row" gap={1} mt={1}>
						{project.technologies.slice(0, 4).map((tech) => (
							<Chip label={tech} key={tech} variant="outlined" />
						))}
						{project.technologies.length > 4 && (
							<Chip
								label={`+${project.technologies.length - 1}`}
								variant="outlined"
							/>
						)}
					</Stack>
				</CardContent>
			</Card>
		</Grid>
	);
}

export default ProjectCard;
