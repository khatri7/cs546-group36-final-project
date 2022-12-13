import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import CommentCard from './CommentCard';

function CommentList({ commentsList = [] }) {
	const user = useSelector((state) => state.user);

	if (commentsList.length === 0) return <Typography>No comments</Typography>;
	return (
		<Stack spacing={2}>
			{commentsList.map((comment, index) => (
				<div>
					<CommentCard
						comment={comment}
						key={comment._id}
						isOwner={Boolean(user?._id && user._id === comment.owner._id)}
					/>
					{index < commentsList.length - 1 && <Divider />}
				</div>
			))}
		</Stack>
	);
}

export default CommentList;
