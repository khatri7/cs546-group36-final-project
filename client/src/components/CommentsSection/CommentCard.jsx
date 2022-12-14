import React from 'react';
import { Grid, Card, Tooltip, Typography, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

function CommentCard({ comment }) {
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
					<Link
						to={`/users/${comment.owner.username}`}
						style={{ textDecoration: 'none' }}
						relative="path"
					>
						{comment.owner.username}
					</Link>
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
