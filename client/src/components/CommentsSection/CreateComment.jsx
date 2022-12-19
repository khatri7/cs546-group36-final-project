import React from 'react';
import {
	TextField,
	Button,
	Box,
	CircularProgress,
	Avatar,
} from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const schema = Yup.object().shape({
	comment: Yup.string().nullable(),
});

function CreateComment({ reqFn, handleNewComment = () => {} }) {
	const user = useSelector((state) => state.user);

	if (!user) return null;

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				gap: 2,
				width: '100%',
			}}
		>
			<Avatar
				src={user.avatar}
				alt={`${user.firstName} ${user.lastName}`}
				sx={{
					width: 40,
					height: 40,
				}}
			/>
			<Formik
				initialValues={{
					comment: '',
				}}
				validationSchema={schema}
				validate={(values) => {
					const errors = {};
					if (values.comment && values.comment.trim().length < 3)
						errors.comment = 'Comment should be at least 3 characters';
					return errors;
				}}
				onSubmit={async (values, { resetForm }) => {
					const commentObj = {
						comment: values.comment.trim(),
					};
					const resp = await reqFn(commentObj);
					if (!resp.comment) throw new Error();
					handleNewComment(resp.comment);
					resetForm();
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
					<Form className="createComment__form">
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 2,
								width: '100%',
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
