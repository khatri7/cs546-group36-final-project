import {
	Box,
	Button,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	Stack,
	Switch,
	TextField,
} from '@mui/material';
import TechnologiesAutocomplete from 'components/TechnologiesAutocomplete';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { errorAlert, successAlert } from 'store/alert';
import { createIdea, handleError } from 'utils/api-calls';
import { deepEquality, isValidSkills } from 'utils/helpers';
import * as Yup from 'yup';

const schema = Yup.object().shape({
	name: Yup.string()
		.required('Idea name is required')
		.matches('^[a-zA-Z0-9 ]*$', 'Invalid Idea name')
		.min(3, 'Idea name should be atleast 3 cahracters'),
	description: Yup.string()
		.required('Description is required')
		.min(10, 'Description should be at least 10 characters'),
	lookingFor: Yup.number('Number of people should be a number')
		.required('Number of people you are looking for is required')
		.min(1, 'Number of people you are looking for should be at least 1')
		.max(50, 'Number of people you are looking for can be a maximum of 50'),
});

function CreateIdea({
	minHeight = 'max-content',
	name = '',
	description = '',
	technologies = [],
	lookingFor = 1,
	cancelComponent,
	requestFn = createIdea,
	onSuccessFn = () => {},
	submitLabel = 'Create Idea',
	onSuccessMsg = 'Idea created successfully',
	showEditStatusField = false,
	status,
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
					description,
					technologies,
					lookingFor,
					status,
				}}
				enableReinitialize
				validationSchema={schema}
				validate={(values) => {
					const errors = {};
					if (values.name.trim().length < 3)
						errors.name = 'Idea name should be at least 3 characters';
					if (values.description.trim().length < 10)
						errors.description = 'Description should be at least 10 characters';
					if (!values.technologies || values.technologies.length < 1)
						errors.technologies =
							'Need to mention at least one technology going to be used';
					if (!isValidSkills(values.technologies))
						errors.skills = 'Invalid Technologies';
					if (values.technologies.length > 10)
						errors.technologies = 'You can add upto 10 skills';
					if (
						!Number.isFinite(parseInt(values.lookingFor, 10)) ||
						values.lookingFor < 1 ||
						values.lookingFor > 50
					)
						errors.lookingFor(
							'Invalid Looking For value: should be a number from 1-50'
						);
					return errors;
				}}
				onSubmit={async (values) => {
					try {
						const ideaObj = values;
						if (showEditStatusField) ideaObj.status = values.status;
						const resp = await requestFn(values);
						if (!resp.idea) throw new Error();
						onSuccessFn(resp.idea);
						dispatch(successAlert(onSuccessMsg));
					} catch (e) {
						let error = 'Unexpected error occurred';
						if (typeof handleError(e) === 'string') error = handleError(e);
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
					setFieldValue,
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
								label="Idea Name"
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
								required
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
								type="number"
								InputProps={{ inputProps: { min: 1, max: 50 } }}
								label="Number of people looking to collaborate with"
								name="lookingFor"
								value={values.lookingFor}
								onKeyDown={(e) => {
									if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
								}}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.lookingFor && Boolean(errors.lookingFor)}
								helperText={touched.lookingFor && errors.lookingFor}
								required
								fullWidth
							/>
							{showEditStatusField && (
								<FormGroup>
									<FormControlLabel
										control={<Switch checked={values.status === 'active'} />}
										label="Is Active"
										onChange={(e) => {
											setFieldValue(
												'status',
												e.target.checked ? 'active' : 'inactive'
											);
										}}
									/>
								</FormGroup>
							)}
							<Stack direction="row" spacing={2}>
								{cancelComponent}
								<Button
									type="submit"
									sx={{
										height: '3rem',
									}}
									variant="contained"
									disabled={
										isSubmitting ||
										!values.name ||
										!values.technologies ||
										values.technologies?.length < 1 ||
										!values.lookingFor ||
										deepEquality(
											{
												...values,
												name: values.name.trim(),
												description: values.description.trim(),
											},
											{
												name,
												description,
												technologies,
												lookingFor,
												status,
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

export default CreateIdea;
