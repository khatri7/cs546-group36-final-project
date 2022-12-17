import { MoreVertOutlined, OpenInNewOutlined } from '@mui/icons-material';
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Checkbox,
	Chip,
	FormControlLabel,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useDispatch, useSelector } from 'react-redux';
import { errorAlert, successAlert, warningAlert } from 'store/alert';
import {
	bookmarkProject,
	deleteProject,
	handleError,
	likeProject,
	removeProjectBookmark,
	unlikeProject,
} from 'utils/api-calls';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';

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
function ProjectCard({
	project,
	isOwner = false,
	gridCols = 4,
	removeProject = () => {},
	removeProjectOnUnsave,
}) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [anchorElProject, setAnchorElProject] = useState(null);
	const [likes, setLikes] = useState(project.likes);
	const [savedBy, setSavedBy] = useState(project.savedBy);

	const handleAction = async (action, endpoint) => {
		if (!user)
			dispatch(warningAlert('You need to login before performing this action'));
		else {
			try {
				let res;
				if (endpoint === 'likes') {
					if (action) res = await likeProject(project._id);
					else res = await unlikeProject(project._id);
					if (!res.likes) throw new Error();
					setLikes(res.likes);
				}
				if (endpoint === 'bookmark') {
					if (action) res = await bookmarkProject(project._id);
					else res = await removeProjectBookmark(project._id);
					if (!res.savedBy) throw new Error();
					setSavedBy(res.savedBy);
					if (!action && removeProjectOnUnsave) removeProject(project._id);
				}
			} catch (e) {
				let error = 'Unexpected error occurred';
				if (typeof handleError(e) === 'string') error = handleError(e);
				dispatch(errorAlert(error));
			}
		}
	};

	const handleLike = (e) => {
		handleAction(e.target.checked, 'likes');
	};

	const handleBookmark = (e) => {
		handleAction(e.target.checked, 'bookmark');
	};

	const handleOpenProjectMenu = (event) => {
		setAnchorElProject(event.currentTarget);
	};

	const handleCloseProjectMenu = () => {
		setAnchorElProject(null);
	};

	const handleDeleteProject = async () => {
		try {
			await deleteProject(project._id);
			removeProject(project._id);
			dispatch(successAlert('Project deleted successfully'));
		} catch (e) {
			let error = 'Unexpected error occurred';
			if (typeof handleError(e) === 'string') error = handleError(e);
			dispatch(errorAlert(error));
		}
	};
	return (
		<Grid item xs={gridCols}>
			<Card raised sx={{ height: '100%' }}>
				<CardHeader
					title={project.name}
					subheader={
						<Link to={`/users/${project.owner?.username}`}>
							@{project.owner.username}
						</Link>
					}
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
											<Button
												startIcon={<DeleteRoundedIcon />}
												onClick={handleDeleteProject}
												color="error"
											>
												Delete
											</Button>
										</MenuItem>
									</Menu>
								</>
							)}
						</Stack>
					}
				/>
				<CardMedia
					component="img"
					image={
						project.media.filter((item) => item !== null)[0] ||
						'https://www.stockvault.net/data/2019/10/07/269936/thumb16.jpg'
					}
					alt={project.name}
					height={180}
				/>
				<CardContent
					sx={{
						':last-child': {
							pb: 2,
						},
					}}
				>
					<Typography variant="body2" color="text.secondary">
						{project.description?.substring(0, 100)}
						{project.description?.length > 100 && '...'}
					</Typography>
					<Stack direction="row" gap={1} mt={1}>
						{project.technologies.slice(0, 4).map((tech) => (
							<Chip label={tech} key={tech} variant="outlined" />
						))}
						{project.technologies.length > 4 && (
							<Chip
								label={`+${project.technologies.length - 4}`}
								variant="outlined"
							/>
						)}
					</Stack>
					<CardActions sx={{ p: 0 }} disableSpacing>
						<Stack direction="row" gap={1}>
							<FormControlLabel
								control={
									<Checkbox
										inputProps={{ 'aria-label': 'Like' }}
										icon={<FavoriteBorder />}
										checkedIcon={<Favorite />}
										checked={likes.includes(user?._id)}
										onClick={handleLike}
									/>
								}
								label={likes.length}
							/>
							<FormControlLabel
								control={
									<Checkbox
										inputProps={{ 'aria-label': 'Save' }}
										icon={<BookmarkBorderIcon />}
										checkedIcon={<BookmarkIcon />}
										checked={savedBy.includes(user?._id)}
										onClick={handleBookmark}
									/>
								}
								label={savedBy.length}
							/>
							<FormControlLabel
								control={
									<Checkbox
										inputProps={{ 'aria-label': 'Save' }}
										icon={<ChatBubbleOutlineRoundedIcon />}
									/>
								}
								label={project.comments?.length ?? 0}
							/>
						</Stack>
					</CardActions>
				</CardContent>
			</Card>
		</Grid>
	);
}

export default ProjectCard;
