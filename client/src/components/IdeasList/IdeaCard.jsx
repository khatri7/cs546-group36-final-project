import { MoreVertOutlined, OpenInNewOutlined } from '@mui/icons-material';
import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
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
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { handleError, likeIdea, unlikeIdea } from 'utils/api-calls';
import { errorAlert, warningAlert } from 'store/alert';

function IdeaCard({ idea, isOwner = false, gridCols = 4 }) {
	const navigate = useNavigate();
	const [anchorElIdea, setAnchorElIdea] = useState(null);
	const user = useSelector((state) => state.user);
	const [likes, setLikes] = useState(idea.likes);
	const dispatch = useDispatch();

	const handleOpenIdeaMenu = (event) => {
		setAnchorElIdea(event.currentTarget);
	};

	const handleCloseIdeaMenu = () => {
		setAnchorElIdea(null);
	};

	const handleLike = async (e) => {
		if (!user)
			dispatch(
				warningAlert('You need to login before liking/unliking a project')
			);
		else {
			try {
				let res;
				if (e.target.checked) res = await likeIdea(idea._id);
				else res = await unlikeIdea(idea._id);
				if (!res.likes) throw new Error();
				setLikes(res.likes);
			} catch (err) {
				let error = 'Unexpected error occurred';
				if (typeof handleError(err) === 'string') error = handleError(err);
				dispatch(errorAlert(error));
			}
		}
	};

	return (
		<Grid item xs={gridCols}>
			<Card raised sx={{ height: '100%' }}>
				<CardHeader
					title={idea.name}
					subheader={
						<Link
							to={`/users/${idea.owner?.username}`}
							style={{
								all: 'unset',
								cursor: 'pointer',
							}}
						>
							@{idea.owner.username}
						</Link>
					}
					action={
						<Stack direction="row" gap={1}>
							<IconButton
								onClick={() => {
									navigate(`/ideas/${idea._id}`);
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
						</Stack>
					</CardActions>
				</CardContent>
			</Card>
		</Grid>
	);
}

export default IdeaCard;
