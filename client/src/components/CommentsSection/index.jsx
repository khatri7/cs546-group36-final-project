import React, { useState, useEffect } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import { Divider, Stack, Typography } from '@mui/material';
import CreateComment from './CreateComment';
import CommentList from './CommentList';

function CommentsSection({
	deleteCommentReqFn,
	comments,
	isOwner,
	createCommentReqFn,
}) {
	const [commentsList, setCommentsList] = useState(comments.reverse());
	useEffect(() => {
		const updatedComments = comments.reverse();
		setCommentsList(updatedComments);
	}, [comments]);
	const handleNewComment = (newComment) => {
		const updatedComments = [newComment, ...commentsList];
		setCommentsList(updatedComments);
	};
	const handleDeleteComment = (updatedCommentsList) => {
		const updatedComments = updatedCommentsList.reverse();
		setCommentsList(updatedComments);
	};
	return (
		<>
			<Divider variant="middle" />
			<Stack direction="row" alignItems="center">
				<ChatIcon sx={{ mr: 1, width: 30, height: 30 }} />
				<Typography variant="h5" component="h3" sx={{ mb: 2, mt: 2 }}>
					Comments ({commentsList.length})
				</Typography>
			</Stack>
			<CreateComment
				reqFn={createCommentReqFn}
				handleNewComment={handleNewComment}
			/>
			<CommentList
				reqFn={deleteCommentReqFn}
				commentsList={commentsList}
				isOwner={isOwner}
				handleDeleteComment={handleDeleteComment}
			/>
		</>
	);
}

export default CommentsSection;
