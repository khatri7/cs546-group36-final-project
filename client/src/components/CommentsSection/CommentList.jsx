import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import CommentCard from './CommentCard';

function CommentList({
	commentsList = [],
	reqFn,
	handleDeleteComment = () => {},
	isOwner,
}) {
	const user = useSelector((state) => state.user);

	if (commentsList.length === 0)
		return (
			<Box sx={{ py: 4 }}>
				<Typography>No comments</Typography>
			</Box>
		);

	return (
		<Box sx={{ py: 4 }}>
			<Stack spacing={3}>
				{commentsList.map((comment) => (
					<CommentCard
						reqFn={reqFn}
						handleDeleteComment={handleDeleteComment}
						comment={comment}
						isOwner={
							Boolean(user?._id && user._id === comment.owner._id) || isOwner
						}
						key={comment._id}
					/>
				))}
			</Stack>
		</Box>
	);
}

export default CommentList;
