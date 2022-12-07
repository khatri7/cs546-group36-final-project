import { Box, Button, CircularProgress, TextField } from '@mui/material';
import TechnologiesAutocomplete from 'components/TechnologiesAutocomplete';
import { Field, Form, Formik } from 'formik';
import React from 'react';

function CreateProject() {
	return (
		<Box
			sx={{
				minHeight: '60vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 4,
			}}
		>
			<Formik
				initialValues={{
					name: '',
					description: '',
				}}
				onSubmit={(values) => {
					console.log(values);
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
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 2,
								minWidth: '500px',
							}}
						>
							<TextField
								variant="outlined"
								label="Project Name"
								name="name"
								value={values.name}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.name && Boolean(errors.name)}
								helperText={touched.name && errors.name}
								fullWidth
								required
							/>
							<TextField
								variant="outlined"
								label="Description"
								name="description"
								value={values.description}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.description && Boolean(errors.description)}
								helperText={touched.description && errors.description}
								fullWidth
							/>
							<Field
								name="technologies"
								component={TechnologiesAutocomplete}
								label="Technologies"
								required
								id="select-technologies-autocomplete"
							/>
							<TextField
								variant="outlined"
								label="Source Code (GitHub)"
								name="github"
								value={values.github}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.github && Boolean(errors.github)}
								helperText={touched.github && errors.github}
								fullWidth
							/>
							<TextField
								variant="outlined"
								label="Deployment Link"
								name="description"
								value={values.deploymentLink}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.deploymentLink && Boolean(errors.deploymentLink)}
								helperText={touched.deploymentLink && errors.deploymentLink}
								fullWidth
							/>
							<Button
								type="submit"
								sx={{
									height: '3rem',
									width: '10rem',
								}}
								variant="contained"
								disabled={isSubmitting}
							>
								{isSubmitting ? <CircularProgress /> : 'Create Project'}
							</Button>
						</Box>
					</Form>
				)}
			</Formik>
		</Box>
	);
}

export default CreateProject;
