import {
	Card,
	Box,
	Typography,
	Grid,
	Chip,
	IconButton,
	Badge,
	Avatar,
	CardHeader,
	CardMedia,
	CardContent,
	Tooltip,
	Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { React, useState, useEffect } from 'react';
import CreateComment from '../CreateComment';
// import Technologies from 'components/Idea/Technologies';
// import CommentList from 'components/CommentsList/CommentList';

function IdeaInfo({ idea }) {
	const ideaName = idea.name;
	const ownerName = idea.owner.username;
	const technologiesUsed = idea.technologies;
	let { likes } = idea;
	likes = likes.length;
	const { description, createdAt, status, lookingFor } = idea;

	const [comments, setComments] = useState(idea.comments);

	function getFormatterTime(timestamp) {
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};
		const time = new Date(timestamp);

		return time.toLocaleDateString('en-US', options);
	}

	const createComment = () => {
		setComments([newComment, ...comments]);
	};

	useEffect(() => {
		setComments(idea.comments);
	}, [idea.comments]);

	function getSubHeader() {
		return `Create On: ${getFormatterTime(createdAt)}`;
	}

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
	function handleIdeaLikes() {}
	function handleDeleteIdea() {}

	function notificationsLabel(count) {
		if (count === 0) {
			return 'no notifications';
		}
		if (count > 99) {
			return 'more than 99 notifications';
		}
		return `${count} notifications`;
	}

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
							{getAvatarInitials(ownerName)}
						</Avatar>
					}
					title={<Typography variant="h5">{ownerName}</Typography>}
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
								{ideaName}
							</Typography>
							{technologiesUsed.slice(0, 6).map((tech) => (
								<Chip label={tech} key={tech} sx={{ mr: 1 }} />
							))}
						</Grid>
						<Grid item xs={4}>
							<Box display="flex" justifyContent="flex-end">
								<Tooltip title="Likes count" arrow>
									<IconButton
										onClick={handleIdeaLikes()}
										aria-label={notificationsLabel({ likes })}
									>
										<Badge color="primary" badgeContent={likes}>
											<FavoriteIcon sx={{ width: 35, height: 35 }} />
										</Badge>
									</IconButton>
								</Tooltip>
								<Tooltip title="Delete Project?" arrow>
									<IconButton onClick={handleDeleteIdea()} color="error">
										<DeleteIcon sx={{ width: 35, height: 35 }} />
									</IconButton>
								</Tooltip>
							</Box>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="body2">{description}</Typography>
							<Typography variant="body2">{status}</Typography>
							<Typography variant="body2">{lookingFor}</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} sx={{ mt: 6, p: 1 }}>
						<Divider variant="middle" />
						<Grid container wrap="nowrap" spacing={2}>
							<Grid item>
								<Avatar alt={ownerName} sx={{ bgcolor: '#1976d2' }}>
									{getAvatarInitials(ownerName)}
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
											<CreateComment source="idea" />
										</Grid>
									</Grid>
								</form>
							</Card>
						</Grid>
						{comments.map((comment) => (
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
											label={getFormatterTime(comment.createdAt)}
											key={getFormatterTime(comment.createdAt)}
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

export default IdeaInfo;
