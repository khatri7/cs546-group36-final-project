import React from 'react';
import { Stack, Typography } from '@mui/material';

function CommentCard({ comment }) {
	// Implement edit functionality form the comments
	const date = comment.createdAt;
	const date1 = Date.parse(date);
	const days = (date2, date3) => {
		const difference = date2 - date3;
		const TotalDays = Math.ceil(difference / (1000 * 3600));
		return TotalDays;
	};
	const timeElapsed = days(Date.now(), date1);

	return (
		<div>
			<Stack>
				<Stack direction="row" justifyContent="space-between">
					<Typography>{comment.owner.username}</Typography>
					<Typography>{timeElapsed} Hours ago</Typography>
				</Stack>
				<Typography> {comment.comment}</Typography>
			</Stack>
		</div>
	);
}
export default CommentCard;
