import React, { useState, useEffect } from 'react';
import CreateComment from './CreateComment';
import CommentList from './CommentList';

function CommentsSection({ ideaId, comments, isOwner }) {
	const [commentsList, setCommentsList] = useState(comments.reverse());
	useEffect(() => {
		const updatedComments = comments.reverse();
		setCommentsList(updatedComments);
	}, [comments]);
	const handleNewComment = (newComment) => {
		const updatedComments = [newComment, ...comments];
		setCommentsList(updatedComments);
	};
	const handleDeleteComment = (updatedCommentsList) => {
		const updatedComments = updatedCommentsList.reverse();
		setCommentsList(updatedComments);
	};
	return (
		<>
			<CreateComment ideaId={ideaId} handleNewComment={handleNewComment} />
			<CommentList
				ideaId={ideaId}
				commentsList={commentsList}
				isOwner={isOwner}
				handleDeleteComment={handleDeleteComment}
			/>
		</>
	);
}

export default CommentsSection;
