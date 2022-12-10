import React, { useState } from 'react';
import {
	Card,
	CardContent,
	Box,
	Typography,
	Stack,
	IconButton,
	TextField,
	Button,
	CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Form, Formik } from 'formik';
import { handleError, updateUser } from 'utils/api-calls';
import { errorAlert, successAlert } from 'store/alert';
import { useDispatch } from 'react-redux';

function Bio({ username, bio, handleUpdateUser, isCurrentUserProfile }) {
	const [showEditForm, setShowEditForm] = useState(false);
	const dispatch = useDispatch();
	return (
		<Card raised>
			<CardContent>
				<Stack direction="row" justifyContent="space-between">
					<Typography variant="h4" component="h2">
						Bio
					</Typography>
					{isCurrentUserProfile && (
						<IconButton
							aria-label="edit profile"
							sx={{ alignSelf: 'flex-end' }}
							onClick={() => {
								setShowEditForm(true);
							}}
						>
							<EditIcon />
						</IconButton>
					)}
				</Stack>
				{showEditForm ? (
					<Box sx={{ mt: 2 }}>
						<Formik
							initialValues={{
								bio,
							}}
							enableReinitialize
							onSubmit={async (values, { setSubmitting }) => {
								try {
									setSubmitting(true);
									const resp = await updateUser(username, {
										bio: values.bio.trim(),
									});
									if (!resp.user) throw new Error();
									handleUpdateUser(resp.user);
									setShowEditForm(false);
									dispatch(successAlert('Bio updated successfully'));
								} catch (e) {
									let error = 'Unexpected error occurred';
									if (typeof handleError(e) === 'string')
										error = handleError(e);
									dispatch(errorAlert(error));
								} finally {
									setSubmitting(false);
								}
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
									<TextField
										fullWidth
										label="Bio"
										variant="outlined"
										name="bio"
										value={values.bio || ''}
										onChange={handleChange}
										onBlur={handleBlur}
										error={touched.bio && Boolean(errors.bio)}
										helperText={touched.bio && errors.bio}
									/>
									<Stack
										direction="row"
										gap={2}
										sx={{
											mt: 2,
										}}
										justifyContent="flex-end"
									>
										<Button
											type="button"
											onClick={() => {
												setShowEditForm(false);
											}}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											variant="contained"
											disabled={isSubmitting}
										>
											{isSubmitting ? <CircularProgress /> : 'Save'}
										</Button>
									</Stack>
								</Form>
							)}
						</Formik>
					</Box>
				) : (
					<Box sx={{ mt: 2 }}>
						<Typography>{bio}</Typography>
					</Box>
				)}
			</CardContent>
		</Card>
	);
}

export default Bio;
