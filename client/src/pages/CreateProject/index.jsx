import { Box, Button, CircularProgress, TextField } from '@mui/material';
import TechnologiesAutocomplete from 'components/TechnologiesAutocomplete';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { errorAlert, successAlert } from 'store/alert';
import { createProject } from 'utils/api-calls';
import { isValidSkills } from 'utils/helpers';
import * as Yup from 'yup';

const schema = Yup.object().shape({
	name: Yup.string()
		.required('Project name is required')
		.matches('^[a-zA-Z0-9 ]*$', 'Invalid Project name')
		.min(3, 'Project name should be atleast 3 cahracters'),
	description: Yup.string(),
});

function CreateProject() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = useSelector((state) => state.user?.token);
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
					technologies: [],
					github: '',
					deploymentLink: '',
				}}
				validationSchema={schema}
				validate={(values) => {
					const errors = {};
					if (values.name.trim().length < 3)
						errors.name = 'Project name should be at least 3 characters';
					if (!values.technologies || values.technologies.length < 1)
						errors.technologies =
							'Need to mention at least one technology used';
					if (!isValidSkills(values.technologies))
						errors.skills = 'Invalid skills';
					return errors;
				}}
				onSubmit={async (values) => {
					try {
						const projectObj = {
							...values,
							github:
								values.github.trim().length === 0 ? null : values.github.trim(),
							deploymentLink:
								values.deploymentLink.trim().length === 0
									? null
									: values.deploymentLink.trim(),
						};
						const resp = await createProject(projectObj, token);
						if (!resp.project) throw new Error();
						navigate(`/projects/${resp.project._id}`);
						dispatch(successAlert('Project created successfully'));
					} catch (e) {
						let error = 'Unexpected error occured';
						if (typeof e.responseJSON?.message === 'string') {
							error = e.responseJSON.message;
						} else if (typeof e.statusText === 'string') error = e.statusText;
						dispatch(errorAlert(error));
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
								name="deploymentLink"
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
								disabled={
									isSubmitting ||
									!values.name ||
									!values.technologies ||
									values.technologies?.length < 1 ||
									Object.keys(errors).length > 0
								}
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
