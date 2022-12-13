import React from 'react';
import { TextField, Button, Box, CircularProgress } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { createIdeaComment } from 'utils/api-calls';

const schema = Yup.object().shape({
	comment: Yup.string()
		.required('comment data required')
		.min(3, 'comment should be atleast 3 cahracters'),
});

function CreateComment({ ideaId, handleNewComment = () => {} }) {
	return (
		<Box
			sx={{
				marginTop: '50px',
				minHeight: '20vh',
				display: 'flex',
				flexDirection: 'row',
				gap: 2,
			}}
		>
			<Formik
				initialValues={{
					comment: '',
				}}
				validationSchema={schema}
				validate={(values) => {
					const errors = {};
					if (values.comment.trim().length < 3)
						errors.comment = 'Comment should be at least 3 characters';
					return errors;
				}}
				onSubmit={async (values) => {
					const commentObj = {
						comment: values.comment.trim(),
					};
					const resp = await createIdeaComment(commentObj, ideaId);
					if (!resp.comment) throw new Error();
					handleNewComment(resp.comment);
				}}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					isSubmitting,
				}) => (
					<Form>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 2,
								minWidth: '300%',
							}}
						>
							<TextField
								variant="outlined"
								label="Comment"
								name="comment"
								value={values.comment}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.comment && Boolean(errors.comment)}
								helperText={touched.comment && errors.comment}
								fullWidth
							/>
							<Button
								type="submit"
								sx={{
									height: '3rem',
									width: '7rem',
								}}
								variant="contained"
								disabled={values.comment.trim().length === 0}
							>
								{isSubmitting ? <CircularProgress /> : 'Comment'}
							</Button>
						</Box>
					</Form>
				)}
			</Formik>
		</Box>
	);
}
export default CreateComment;
