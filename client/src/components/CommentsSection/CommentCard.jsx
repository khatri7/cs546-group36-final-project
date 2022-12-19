import React from 'react';
import {
	Card,
	Tooltip,
	Typography,
	IconButton,
	Avatar,
	Stack,
	CardContent,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { handleError } from 'utils/api-calls';
import { errorAlert, successAlert } from 'store/alert';
import { useDispatch } from 'react-redux';
import moment from 'moment';

function CommentCard({
	comment,
	isOwner,
	reqFn,
	handleDeleteComment = () => {},
}) {
	const dispatch = useDispatch();
	return (
		<Stack direction="row" spacing={2}>
			<Avatar sx={{ mt: 1 }}>
				{comment.owner.username.charAt(0).toUpperCase()}
			</Avatar>
			<Card raised sx={{ width: '100%', m: 2, borderRadius: 3 }}>
				<CardContent
					sx={{
						py: 1,
						':last-child': {
							pb: 1.5,
						},
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Link
							to={`/users/${comment.owner.username}`}
							style={{ textDecoration: 'none' }}
							relative="path"
						>
							<Typography variant="h6">{comment.owner.username}</Typography>
						</Link>
						{isOwner && (
							<Tooltip title="Delete Comment" arrow>
								<IconButton
									onClick={async () => {
										try {
											const resp = await reqFn(comment._id);
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
					<Typography sx={{ mb: 2 }}>{comment.comment}</Typography>
					<Typography variant="body2" color="text.secondary">
						posted {moment(comment.createdAt).fromNow()}
					</Typography>
				</CardContent>
			</Card>
		</Stack>
	);
}
export default CommentCard;
