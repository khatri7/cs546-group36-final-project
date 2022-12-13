import React from 'react';
import { Grid, Card, Tooltip, Typography, Chip, Avatar } from '@mui/material';

function CommentCard({ comment }) {
	// console.log(comment);
	// Implement edit functionality form the comments
	// const date = comment.createdAt;
	// const date1 = Date.parse(date);
	// const days = (date2, date3) => {
	// 	const difference = date2 - date3;
	// 	const TotalDays = Math.ceil(difference / (1000 * 3600));
	// 	return TotalDays;
	// };
	// const timeElapsed = days(Date.now(), date1);
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
	function getFormatterTime(timestamp) {
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};
		const time = new Date(timestamp);

		return time.toLocaleDateString('en-US', options);
	}

	return (
		<div>
			<Grid container wrap="nowrap" spacing={2}>
				<Card raised sx={{ height: 'auto', width: '100%', p: 1, m: 2 }}>
					<Avatar alt={comment.owner.username}>
						{getAvatarInitials(comment.owner.username)}
					</Avatar>
					<Typography variant="h6" sx={{ mb: 1 }}>
						{comment.owner.username}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
		</div>
	);
}
export default CommentCard;
