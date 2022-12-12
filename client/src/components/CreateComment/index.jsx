import { React, useState } from 'react';
import { TextField, Grid, Tooltip, Button } from '@mui/material';
import * as Yup from 'yup';

const [commentName, setCommentName] = useState('');

const schema = Yup.object().shape({
	comment: Yup.string()
		.required('comment data required')
		.min(3, 'comment should be atleast 3 cahracters'),
});

function createComment() {
	return (
		<>
			<TextField
				id="inputCommentText"
				label="Comment here"
				placeholder="Your comment(s) goes here..."
				sx={{ height: '100%', width: '100%' }}
				value={commentName}
				onChange={(e) => {
					setCommentName(e.target.value);
				}}
			/>

			<Grid item xs={2}>
				<Tooltip title="Post your comment" arrow>
					<Button
						variant="contained"
						sx={{ height: '100%', width: '100%' }}
						endIcon={<SendIcon />}
						type="submit"
						onClick={createComment}
					>
						Comment
					</Button>
				</Tooltip>
			</Grid>
		</>
	);
}
export default createComment;
