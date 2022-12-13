import React, { useState, useEffect } from 'react';
import CreateComment from './CreateComment';
import CommentList from './CommentList';

function CommentsSection({ ideaId, comments }) {
	const [commentsList, setCommentsList] = useState(comments.reverse());
	useEffect(() => {
		const updatedComments = comments.reverse();
		setCommentsList(updatedComments);
	}, [comments]);
	const handleNewComment = (newComment) => {
		const updatedComments = [newComment, ...comments];
		setCommentsList(updatedComments);
	};
	return (
		<>
			<CreateComment ideaId={ideaId} handleNewComment={handleNewComment} />
			<CommentList commentsList={commentsList} />
		</>
	);
}

export default CommentsSection;
