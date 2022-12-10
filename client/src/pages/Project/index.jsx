import React, { useState } from 'react';
import useQuery from 'hooks/useQuery';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import {
	Typography,
	Grid,
	Chip,
	Card,
	IconButton,
	Box,
	Badge,
	MobileStepper,
	Button,
	Avatar,
	CardHeader,
	CardMedia,
	CardContent,
	TextField,
	Tooltip,
	Divider,
	Link,
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import GitHubIcon from '@mui/icons-material/GitHub';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import { isEmptyArray } from 'formik';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Project() {
	const theme = useTheme();
	const { projectId } = useParams();
	const { data, loading, error } = useQuery(`/projects/${projectId}`); // GetProjectByID API CAll
	// const rawUserData = useQuery(`/users/${data.project.owner.username}`); // GetUserByUsername API CAll
	const [activeStep, setActiveStep] = useState(0);

	if (error) return <Typography>{error}</Typography>;
	if (loading) return <Typography>Loading...</Typography>;
	if (!data) return <Typography>Error getting Project details!</Typography>;

	const projectName = data.project.name;
	const projectDescription = data.project.description;
	const projectGithub = data.project.github;
	let projectMedia = data.project.media;
	const projectDeploymentLink = data.project.deploymentLink;
	let projectSavedBy = data.project.savedBy.length;
	const projectComments = data.project.comments;
	let projectLikes = data.project.likes.length;
	const projectCreatedAt = data.project.createdAt;
	const projectUpdatedAt = data.project.updatedAt;
	const projectTechnologies = data.project.technologies;
	const projectOwner = data.project.owner.username;

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
		return `Create On: ${getFormatterTime(
			projectCreatedAt
		)} | Last Updated On: ${getFormatterTime(projectUpdatedAt)}`;
	}

	function handleProjectLikes() {
		projectLikes += 1;
	}

	function handleProjectSaves() {
		projectSavedBy += 1;
	}

	function handleDeleteProject() {}

	function getAvatarInitials(name) {
		let initials = 'AB';
		if (name) {
			const _owner = name.split();
			if (_owner.length === 2) {
				initials =
					_owner[0].charAt(0).toUpperCase() + _owner[1].charAt(0).toUpperCase();
			} else {
				initials = name.charAt(0).toUpperCase();
			}
		}
		return initials;
	}

	function notificationsLabel(count) {
		if (count === 0) {
			return 'no notifications';
		}
		if (count > 99) {
			return 'more than 99 notifications';
		}
		return `${count} notifications`;
	}

	if (isEmptyArray(projectMedia) || projectMedia.length === 0) {
		projectMedia = [
			'https://freelancingjournal.com/wp-content/uploads/2020/05/home-office-accessories-1024x652.jpeg',
			'https://freelancingjournal.com/wp-content/uploads/2020/05/start-a-blog-freelancer-1024x683.jpeg',
		];
	}

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	return (
		<Grid item xs={12}>
			<Card raised sx={{ height: '100%', p: 0 }}>
				<CardMedia
					component="img"
					height="100%"
					image="https://resumespice.com/wp-content/uploads/2021/03/1-980x245.png"
					alt="Coffee Mug"
				/>
				<CardHeader
					avatar={
						<Avatar sx={{ width: 50, height: 50, bgcolor: '#1976d2' }}>
							{getAvatarInitials(projectOwner)}
						</Avatar>
					}
					title={<Typography variant="h5">{projectOwner}</Typography>}
					subheader={<Typography variant="body2">{getSubHeader()}</Typography>}
					action={
						<IconButton aria-label="settings">
							<AccountCircleIcon />
						</IconButton>
					}
				/>
				<Divider variant="middle" />
				<CardContent sx={{ p: 2 }}>
					<Grid container spacing={3}>
						<Grid item xs={8}>
							<Typography variant="h4" component="div">
								{projectName}
							</Typography>
							{projectTechnologies.slice(0, 6).map((tech) => (
								<Chip label={tech} key={tech} sx={{ mr: 1 }} />
							))}
						</Grid>
						<Grid item xs={4}>
							<Box display="flex" justifyContent="flex-end">
								<Tooltip title="Deployment Link" arrow>
									<Link href={projectDeploymentLink}>
										<IconButton color="primary">
											<BuildCircleIcon sx={{ width: 35, height: 35 }} />
										</IconButton>
									</Link>
								</Tooltip>
								<Tooltip title="GitHub Link" arrow>
									<Link href={projectGithub}>
										<IconButton color="primary">
											<GitHubIcon sx={{ width: 35, height: 35 }} />
										</IconButton>
									</Link>
								</Tooltip>
								<Tooltip title="Total Bookmarks" arrow>
									<IconButton
										onClick={handleProjectSaves()}
										aria-label={notificationsLabel({ projectSavedBy })}
									>
										<Badge color="primary" badgeContent={projectSavedBy}>
											<BookmarkIcon sx={{ width: 35, height: 35 }} />
										</Badge>
									</IconButton>
								</Tooltip>
								<Tooltip title="Likes count" arrow>
									<IconButton
										onClick={handleProjectLikes()}
										aria-label={notificationsLabel({ projectLikes })}
									>
										<Badge color="primary" badgeContent={projectLikes}>
											<FavoriteIcon sx={{ width: 35, height: 35 }} />
										</Badge>
									</IconButton>
								</Tooltip>
								<Tooltip title="Delete Project?" arrow>
									<IconButton onClick={handleDeleteProject()} color="error">
										<DeleteIcon sx={{ width: 35, height: 35 }} />
									</IconButton>
								</Tooltip>
							</Box>
						</Grid>
						<Grid item xs={6}>
							<img
								style={{
									borderRadius: 15,
									height: 280,
									width: '100%',
									maxWidth: 550,
								}}
								src={projectMedia[activeStep]}
								alt={projectMedia[activeStep]}
							/>
							<MobileStepper
								index={activeStep}
								steps={projectMedia.length}
								position="static"
								activeStep={activeStep}
								nextButton={
									<Button
										size="small"
										onClick={handleNext}
										disabled={activeStep === projectMedia.length - 1}
									>
										Next
										{theme.direction === 'rtl' ? (
											<KeyboardArrowLeft />
										) : (
											<KeyboardArrowRight />
										)}
									</Button>
								}
								backButton={
									<Button
										size="small"
										onClick={handleBack}
										disabled={activeStep === 0}
									>
										{theme.direction === 'rtl' ? (
											<KeyboardArrowRight />
										) : (
											<KeyboardArrowLeft />
										)}
										Back
									</Button>
								}
							/>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="body2">{projectDescription}</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} sx={{ mt: 6, p: 1 }}>
						<Divider variant="middle" />
						<Typography variant="h5" sx={{ mb: 2, mt: 2 }}>
							<Badge color="primary" badgeContent={projectSavedBy}>
								Top Comments
								<Tooltip title="Total comments count" arrow>
									<ChatIcon sx={{ ml: 1, width: 35, height: 35 }} />
								</Tooltip>
							</Badge>
						</Typography>
						<Grid container wrap="nowrap" spacing={2}>
							<Grid item>
								<Avatar alt={projectOwner} sx={{ bgcolor: '#1976d2' }}>
									{getAvatarInitials(projectOwner)}
								</Avatar>
							</Grid>
							<Card raised sx={{ height: '100%', width: '100%', p: 1, m: 2 }}>
								<form
									onSubmit={(event) => {
										event.preventDefault();
									}}
								>
									<Grid container spacing={1}>
										<Grid item xs={10}>
											<TextField
												id="inputCommentText"
												label="Comment here"
												placeholder="Your comment(s) goes here..."
												sx={{ height: '100%', width: '100%' }}
											/>
										</Grid>
										<Grid item xs={2}>
											<Tooltip title="Post your comment" arrow>
												<Button
													variant="contained"
													sx={{ height: '100%', width: '100%' }}
													endIcon={<SendIcon />}
												>
													Comment
												</Button>
											</Tooltip>
										</Grid>
									</Grid>
								</form>
							</Card>
						</Grid>
						{projectComments.map((comment) => (
							<Grid container wrap="nowrap" spacing={2}>
								<Grid item>
									<Avatar alt={comment.owner.username}>
										{getAvatarInitials(comment.owner.username)}
									</Avatar>
								</Grid>
								<Card raised sx={{ height: 'auto', width: '100%', p: 1, m: 2 }}>
									<Typography variant="h6" sx={{ mb: 1 }}>
										{comment.owner.username}
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 1 }}
									>
										{comment.comment}
									</Typography>
									<Tooltip title="Date posted on" arrow placement="right">
										<Chip
											label={getFormatterTime(comment.timestamp)}
											key={getFormatterTime(comment.timestamp)}
											sx={{ mr: 1 }}
										/>
									</Tooltip>
								</Card>
							</Grid>
						))}
					</Grid>
				</CardContent>
			</Card>
		</Grid>
	);
}
