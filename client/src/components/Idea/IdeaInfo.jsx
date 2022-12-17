import {
	Box,
	Typography,
	Chip,
	Avatar,
	Divider,
	Stack,
	Button,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	createIdeaComment,
	deleteIdea,
	deleteIdeaComment,
	handleError,
	likeIdea,
	unlikeIdea,
	updateIdea,
} from 'utils/api-calls';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useDispatch, useSelector } from 'react-redux';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { errorAlert, successAlert, warningAlert } from 'store/alert';
import CommentsSection from '../CommentsSection';
import CreateIdea from './CreateIdea';

function IdeaInfo({ idea: ideaProp }) {
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [idea, setIdea] = useState(ideaProp);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		setIdea(ideaProp);
	}, [ideaProp]);

	const handleUpdate = (updatedIdea) => {
		setIdea(updatedIdea);
		setIsEditing(false);
	};

	const ideaName = idea.name;
	const ideaId = idea._id;
	const ideaOwner = idea.owner;
	const technologiesUsed = idea.technologies;
	const { description, createdAt, comments, status, lookingFor, likes } = idea;

	const isCurrentUsersIdea = user?._id === ideaOwner._id;

	function getFormatterTime(timestamp) {
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};
		const time = new Date(timestamp);

		return time.toLocaleDateString('en-US', options);
	}

	function getSubHeader() {
		return `Created On: ${getFormatterTime(createdAt)}`;
	}

	const handleLike = async (e) => {
		if (!user)
			dispatch(
				warningAlert('You need to login before liking/unliking an idea')
			);
		else {
			try {
				let res;
				if (e.target.checked) res = await likeIdea(ideaId);
				else res = await unlikeIdea(ideaId);
				if (!res.likes) throw new Error();
				setIdea({
					...idea,
					likes: res.likes,
				});
			} catch (err) {
				let error = 'Unexpected error occurred';
				if (typeof handleError(err) === 'string') error = handleError(err);
				dispatch(errorAlert(error));
			}
		}
	};

	const handleDeleteIdea = async () => {
		try {
			await deleteIdea(ideaId);
			navigate('/ideas');
			dispatch(successAlert('Idea deleted successfully'));
		} catch (e) {
			let errorMsg = 'Unexpected error occurred';
			if (typeof handleError(e) === 'string') errorMsg = handleError(e);
			dispatch(errorAlert(errorMsg));
		}
	};

	return (
		<Box>
			<Stack direction="row" spacing={2}>
				<Avatar sx={{ width: 56, height: 56, bgcolor: '#1976d2' }}>
					{ideaOwner.username.charAt(0).toUpperCase()}
				</Avatar>
				<Box>
					<Link to={`/users/${ideaOwner.username}`}>
						<Typography variant="h5">{ideaOwner.username}</Typography>
					</Link>
					<Typography variant="body2">{getSubHeader()}</Typography>
				</Box>
			</Stack>
			<Divider variant="middle" sx={{ my: 2 }} />
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
				sx={{
					mb: 2,
				}}
			>
				<Box>
					<Stack
						direction="row"
						spacing={2}
						alignItems="center"
						sx={{
							mb: 1,
						}}
					>
						<Typography variant="h4" component="h1">
							{ideaName}
						</Typography>
						<Chip
							label={status}
							color={status === 'active' ? 'success' : 'default'}
						/>
					</Stack>
					{technologiesUsed.map((tech) => (
						<Chip label={tech} key={tech} sx={{ mr: 1 }} />
					))}
				</Box>
				<Box
					display="flex"
					justifyContent="flex-end"
					sx={{
						gap: 1,
					}}
				>
					{isCurrentUsersIdea && (
						<Stack direction="row" spacing={2}>
							<Button
								variant="outlined"
								onClick={() => {
									setIsEditing(!isEditing);
								}}
								startIcon={<EditRoundedIcon />}
							>
								Edit
							</Button>
							<Button
								variant="contained"
								color="error"
								onClick={handleDeleteIdea}
								startIcon={<DeleteIcon />}
							>
								Delete
							</Button>
						</Stack>
					)}
				</Box>
			</Stack>
			{isEditing ? (
				<CreateIdea
					name={ideaName}
					description={description}
					technologies={technologiesUsed}
					lookingFor={lookingFor}
					submitLabel="Save"
					requestFn={(ideaObj) => updateIdea(ideaId, ideaObj)}
					onSuccessMsg="Idea updated successfully"
					onSuccessFn={handleUpdate}
					showEditStatusField
					status={status}
					cancelComponent={
						<Button
							variant="outlined"
							type="button"
							onClick={() => {
								setIsEditing(false);
							}}
						>
							Cancel
						</Button>
					}
				/>
			) : (
				<>
					<Stack direction="row" spacing={1} alignItems="center">
						<PeopleAltRoundedIcon />
						<Typography variant="h6">Looking For: {lookingFor}</Typography>
					</Stack>
					<Box sx={{ py: 2 }}>
						<Typography>{description}</Typography>
					</Box>
				</>
			)}

			<Box sx={{ p: 1 }}>
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
			</Box>
			<CommentsSection
				ideaId={ideaId}
				createCommentReqFn={async (comment) =>
					createIdeaComment(comment, ideaId)
				}
				deleteCommentReqFn={async (commentId) =>
					deleteIdeaComment(ideaId, commentId)
				}
				comments={comments}
				isOwner={isCurrentUsersIdea}
			/>
		</Box>
	);
}

export default IdeaInfo;
