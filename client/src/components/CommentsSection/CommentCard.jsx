import React from 'react';
import {
	Grid,
	Card,
	Tooltip,
	Typography,
	Chip,
	IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteIdeaComment, handleError } from 'utils/api-calls';
import { errorAlert, successAlert } from 'store/alert';
import { useDispatch } from 'react-redux';

function CommentCard({
	comment,
	isOwner,
	ideaId,
	handleDeleteComment = () => {},
}) {
	const dispatch = useDispatch();
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
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Link
							to={`/users/${comment.owner.username}`}
							style={{ textDecoration: 'none' }}
							relative="path"
						>
							{comment.owner.username}
						</Link>
						{isOwner && (
							<Tooltip title="Delete Project?" arrow>
								<IconButton
									onClick={async () => {
										try {
											const resp = await deleteIdeaComment(ideaId, comment._id);
											if (!resp.comments) throw new Error();
											handleDeleteComment(resp.comments);
											dispatch(successAlert('Comment deleted successfully'));
										} catch (e) {
											let error = 'Unexpected error occurred';
											if (typeof handleError(e) === 'string')
												error = handleError(e);
											dispatch(errorAlert(error));
										}
									}}
									color="error"
								>
									<DeleteIcon sx={{ width: 20, height: 20 }} />
								</IconButton>
							</Tooltip>
						)}
					</div>
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
