import React, { useState, useEffect } from 'react';
import useQuery from 'hooks/useQuery';
import { Link as RRDLink, useNavigate, useParams } from 'react-router-dom';
import {
	Typography,
	Grid,
	Chip,
	IconButton,
	Box,
	Button,
	Avatar,
	Tooltip,
	Divider,
	Link,
	Stack,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import GitHubIcon from '@mui/icons-material/GitHub';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CreateProject from 'components/Project/CreateProject';
import {
	bookmarkProject,
	createProjectComment,
	deleteProject,
	deleteProjectComment,
	handleError,
	likeProject,
	removeProjectBookmark,
	unlikeProject,
	updateProject,
} from 'utils/api-calls';
import { errorAlert, successAlert, warningAlert } from 'store/alert';
import Carousel from 'components/Project/Carousel';
import UploadProjectMedia from 'components/Project/UploadProjectMedia';
import CommentsSection from 'components/CommentsSection';

export default function Project() {
	const { projectId } = useParams();
	const { data, loading, error } = useQuery(`/projects/${projectId}`);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [isEditing, setIsEditing] = useState(false);
	const [project, setProject] = useState(data?.project ?? null);
	const [showUpdateMediaForm, setShowUpdateMediaForm] = useState(false);
	const user = useSelector((state) => state.user);

	useEffect(() => {
		if (data?.project) setProject(data.project);
	}, [data]);

	if (error) return <Typography>{error}</Typography>;
	if (loading) return <Typography>Loading...</Typography>;
	if (!project) return <Typography>Error getting Project details!</Typography>;

	const projectName = project.name;
	const projectDescription = project.description;
	const projectGithub = project.github;
	const projectMedia = project.media;
	const projectDeploymentLink = project.deploymentLink;
	const projectSavedBy = project.savedBy;
	const projectComments = project.comments;
	const projectLikes = project.likes;
	const projectCreatedAt = project.createdAt;
	const projectTechnologies = project.technologies;
	const projectOwner = project.owner;

	const isCurrentUsersProject = user?._id === projectOwner._id;

	const handleUpdate = (updatedProject) => {
		setProject(updatedProject);
		setIsEditing(false);
	};

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
		return `Created On: ${getFormatterTime(projectCreatedAt)}`;
	}

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
					setProject({
						...project,
						likes: res.likes,
					});
				}
				if (endpoint === 'bookmark') {
					if (action) res = await bookmarkProject(project._id);
					else res = await removeProjectBookmark(project._id);
					if (!res.savedBy) throw new Error();
					setProject({
						...project,
						savedBy: res.savedBy,
					});
				}
			} catch (e) {
				let errorMsg = 'Unexpected error occurred';
				if (typeof handleError(e) === 'string') errorMsg = handleError(e);
				dispatch(errorAlert(errorMsg));
			}
		}
	};

	const handleLike = (e) => {
		handleAction(e.target.checked, 'likes');
	};

	const handleBookmark = (e) => {
		handleAction(e.target.checked, 'bookmark');
	};

	const handleDeleteProject = async () => {
		try {
			await deleteProject(project._id);
			navigate('/projects');
			dispatch(successAlert('Project deleted successfully'));
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
					{projectOwner.username.charAt(0).toUpperCase()}
				</Avatar>
				<Box>
					<RRDLink
						to={`/users/${projectOwner.username}`}
						style={{
							all: 'unset',
							cursor: 'pointer',
						}}
					>
						<Typography variant="h5">{projectOwner.username}</Typography>
					</RRDLink>
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
					<Typography
						variant="h4"
						component="h1"
						sx={{
							mb: 1,
						}}
					>
						{projectName}
					</Typography>
					{projectTechnologies.map((tech) => (
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
					{projectDeploymentLink && (
						<Tooltip title="Deployment Link" arrow>
							<Link href={projectDeploymentLink} target="_blank">
								<IconButton>
									<InsertLinkRoundedIcon sx={{ width: 35, height: 35 }} />
								</IconButton>
							</Link>
						</Tooltip>
					)}
					{projectGithub && (
						<Tooltip title="GitHub" arrow>
							<Link href={projectGithub} target="_blank">
								<IconButton>
									<GitHubIcon sx={{ width: 35, height: 35 }} />
								</IconButton>
							</Link>
						</Tooltip>
					)}
					{isCurrentUsersProject && (
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
								onClick={handleDeleteProject}
								startIcon={<DeleteIcon />}
							>
								Delete
							</Button>
						</Stack>
					)}
				</Box>
			</Stack>
			{isEditing ? (
				<CreateProject
					name={projectName}
					description={projectDescription}
					github={projectGithub}
					deploymentLink={projectDeploymentLink}
					technologies={projectTechnologies}
					submitLabel="Save"
					onSuccess={handleUpdate}
					requestFn={(projectObj) => updateProject(project._id, projectObj)}
					onSuccessMsg="Project updated successfully"
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
				<Grid container spacing={3} sx={{ mt: 2 }}>
					<Grid item xs={6}>
						{showUpdateMediaForm ? (
							<UploadProjectMedia
								projectMedia={projectMedia}
								projectId={projectId}
								handleUpdate={handleUpdate}
								close={() => {
									setShowUpdateMediaForm(false);
								}}
							/>
						) : (
							<>
								{Boolean(projectMedia.length > 0) && (
									<Carousel
										projectMedia={projectMedia.filter((item) => item !== null)}
									/>
								)}
								{isCurrentUsersProject && (
									<Stack alignItems="center">
										<Button
											type="button"
											size="small"
											onClick={() => {
												setShowUpdateMediaForm(true);
											}}
										>
											Update Images
										</Button>
									</Stack>
								)}
							</>
						)}
					</Grid>
					<Grid item xs={6}>
						<Typography variant="body2">{projectDescription}</Typography>
					</Grid>
				</Grid>
			)}
			<Box sx={{ mt: 2, p: 1 }}>
				<Stack
					direction="row"
					gap={1}
					sx={{
						mb: 1,
					}}
				>
					<FormControlLabel
						control={
							<Checkbox
								inputProps={{ 'aria-label': 'Like' }}
								icon={<FavoriteBorder />}
								checkedIcon={<Favorite />}
								checked={projectLikes.includes(user?._id)}
								onClick={handleLike}
							/>
						}
						label={projectLikes.length}
					/>
					<FormControlLabel
						control={
							<Checkbox
								inputProps={{ 'aria-label': 'Save' }}
								icon={<BookmarkBorderIcon />}
								checkedIcon={<BookmarkIcon />}
								checked={projectSavedBy.includes(user?._id)}
								onClick={handleBookmark}
							/>
						}
						label={projectSavedBy.length}
					/>
				</Stack>
			</Box>
			<CommentsSection
				createCommentReqFn={async (comment) =>
					createProjectComment(comment, projectId)
				}
				deleteCommentReqFn={async (commentId) =>
					deleteProjectComment(projectId, commentId)
				}
				comments={projectComments}
				isOwner={isCurrentUsersProject}
			/>
		</Box>
	);
}
