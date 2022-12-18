import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import TechnologiesAutocomplete from 'components/TechnologiesAutocomplete';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { errorAlert, successAlert } from 'store/alert';
import { createProject } from 'utils/api-calls';
import { deepEquality, isValidSkills } from 'utils/helpers';
import * as Yup from 'yup';

const schema = Yup.object().shape({
	name: Yup.string()
		.required('Project name is required')
		.matches('^[a-zA-Z0-9 ]*$', 'Invalid Project name')
		.min(3, 'Project name should be atleast 3 cahracters'),
	description: Yup.string().nullable(),
	github: Yup.string()
		.matches(
			'^(http(s?)://)?(www.)?github.com/(?:[-a-zA-Z0-9()@:%_+.~#?&/=]{1,})/?$',
			'Invalid GitHub link'
		)
		.nullable(),
	deploymentLink: Yup.string()
		.matches(
			'^https?://(?:www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$',
			'Invalid Deployment link'
		)
		.nullable(),
});

function CreateProject({
	name = '',
	description = '',
	technologies = [],
	github = '',
	deploymentLink = '',
	minHeight = 'max-content',
	submitLabel = 'Create Project',
	cancelComponent,
	requestFn = createProject,
	onSuccess = () => {},
	onSuccessMsg = 'Project created successfully',
}) {
	const dispatch = useDispatch();
	return (
		<Box
			sx={{
				minHeight,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 4,
			}}
		>
			<Formik
				initialValues={{
					name,
					description: description || '',
					technologies,
					github: github || '',
					deploymentLink: deploymentLink || '',
				}}
				enableReinitialize
				validationSchema={schema}
				validate={(values) => {
					const errors = {};
					if (values.name.trim().length < 3)
						errors.name = 'Project name should be at least 3 characters';
					if (!values.technologies || values.technologies.length < 1)
						errors.technologies =
							'Need to mention at least one technology going to be used';
					else if (values.technologies.length > 10)
						errors.technologies = 'You can only add upto 10 technologies';
					if (!isValidSkills(values.technologies))
						errors.skills = 'Invalid Technologies';
					return errors;
				}}
				onSubmit={async (values) => {
					try {
						const projectObj = {
							...values,
							description:
								values.description.trim().length === 0
									? null
									: values.description.trim(),
							github:
								values.github.trim().length === 0 ? null : values.github.trim(),
							deploymentLink:
								values.deploymentLink.trim().length === 0
									? null
									: values.deploymentLink.trim(),
						};
						const resp = await requestFn(projectObj);
						if (!resp.project) throw new Error();
						onSuccess(resp.project);
						dispatch(successAlert(onSuccessMsg));
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
								value={values.description || ''}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.description && Boolean(errors.description)}
								helperText={touched.description && errors.description}
								fullWidth
							/>
							<Field
								name="technologies"
								component={TechnologiesAutocomplete}
								label="Technologies (upto 10)"
								required
								id="select-technologies-autocomplete"
							/>
							<TextField
								variant="outlined"
								label="Source Code (GitHub)"
								name="github"
								value={values.github || ''}
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
								value={values.deploymentLink || ''}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.deploymentLink && Boolean(errors.deploymentLink)}
								helperText={touched.deploymentLink && errors.deploymentLink}
								fullWidth
							/>
							<Stack direction="row" spacing={2}>
								{cancelComponent}
								<Button
									type="submit"
									sx={{
										height: '3rem',
										width: 'max-content',
									}}
									variant="contained"
									disabled={
										isSubmitting ||
										!values.name ||
										!values.technologies ||
										values.technologies?.length < 1 ||
										deepEquality(
											{
												...values,
												description:
													values.description.trim().length === 0
														? null
														: values.description.trim(),
												github:
													values.github.trim().length === 0
														? null
														: values.github.trim(),
												deploymentLink:
													values.deploymentLink.trim().length === 0
														? null
														: values.deploymentLink.trim(),
											},
											{
												name,

												deploymentLink,
												github,
												technologies,
												description,
											}
										) ||
										Object.keys(errors).length > 0
									}
								>
									{isSubmitting ? <CircularProgress /> : submitLabel}
								</Button>
							</Stack>
						</Box>
					</Form>
				)}
			</Formik>
		</Box>
	);
}

export default CreateProject;
