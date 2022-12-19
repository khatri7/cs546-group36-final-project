import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	FormLabel,
	Stack,
	Switch,
	TextField,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import DatePickerInput from 'components/DatePicker';
import { isValidDateStr, isValidDob, isValidSkills } from 'utils/helpers';
import { handleError, updateUser } from 'utils/api-calls';
import { errorAlert, successAlert } from 'store/alert';
import { useDispatch } from 'react-redux';
import TechnologiesAutocomplete from 'components/TechnologiesAutocomplete';
import moment from 'moment';

const AVAILABILITY = [
	'full-time',
	'part-time',
	'contract',
	'internship',
	'code-collab',
];

const schema = Yup.object().shape({
	firstName: Yup.string()
		.required('First name is required')
		.matches('^[a-zA-Z]*$', 'Invalid First name')
		.min(3, 'First name must be atleast 3 cahracters')
		.max(40, 'First name cannot be greater than 40 cahracters'),
	lastName: Yup.string()
		.required('Last name is required')
		.matches('^[a-zA-Z]*$', 'Invalid Last name')
		.min(3, 'Last name must be atleast 3 characters')
		.max(40, 'Last name cannot be greater than 40 cahracters'),
	dob: Yup.string('Invalid DOB').required('DOB is required'),
	github: Yup.string().matches(
		'^(http(s?)://)?(www.)?github.com/(?:[-a-zA-Z0-9()@:%_+.~#?&/=]{1,})/?$',
		'Invalid GitHub URL'
	),
	linkedin: Yup.string().matches(
		'^(http(s?)://)?(www.)?linkedin.com/(pub|in|profile)/(?:[-a-zA-Z0-9()@:%_+.~#?&/=]{1,})/?$',
		'Invalid LinkedIn URL'
	),
});

function EditUserDetails({
	username,
	firstName,
	lastName,
	dob,
	skills,
	isAvailable,
	availability,
	github = null,
	linkedin = null,
	cancel,
	handleUpdateUser,
}) {
	const dispatch = useDispatch();
	return (
		<Formik
			initialValues={{
				firstName,
				lastName,
				dob,
				skills,
				isAvailable,
				availability,
				github: github || '',
				linkedin: linkedin || '',
			}}
			validationSchema={schema}
			validate={(values) => {
				const errors = {};
				if (!isValidDateStr(values.dob)) errors.dob = 'Invalid DOB';
				if (!isValidDob(values.dob))
					errors.dob = 'Invalid DOB: Should be between 12-100 years in age';
				if (!values.skills || values.skills.length < 1)
					errors.skills = 'Need to mention at least one skill';
				if (!isValidSkills(values.skills)) errors.skills = 'Invalid skills';
				if (values.skills.length > 10)
					errors.skills = 'You can add upto 10 skills';
				if (values.isAvailable && values.availability.length < 1)
					errors.availability = 'You need to select at least one';
				return errors;
			}}
			enableReinitialize
			onSubmit={async (values, { setSubmitting }) => {
				try {
					setSubmitting(true);
					const resp = await updateUser(username, {
						firstName: values.firstName,
						lastName: values.lastName,
						dob: values.dob,
						skills: values.skills,
						isAvailable: values.isAvailable,
						availability: values.isAvailable ? values.availability : [],
						socials: {
							github:
								values.github.trim().length === 0 ? null : values.github.trim(),
							linkedin:
								values.linkedin.trim().length === 0
									? null
									: values.linkedin.trim(),
						},
					});
					if (!resp.user) throw new Error();
					handleUpdateUser(resp.user);
					cancel();
					dispatch(successAlert('Details updated successfully'));
				} catch (e) {
					let error = 'Unexpected error occurred';
					if (typeof handleError(e) === 'string') error = handleError(e);
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
				setFieldValue,
			}) => {
				return (
					<Form className="edituser__form">
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 2,
							}}
						>
							<TextField
								variant="outlined"
								label="First Name"
								name="firstName"
								value={values.firstName}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.firstName && Boolean(errors.firstName)}
								helperText={touched.firstName && errors.firstName}
								fullWidth
								required
							/>
							<TextField
								variant="outlined"
								label="Last Name"
								name="lastName"
								value={values.lastName}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.lastName && Boolean(errors.lastName)}
								helperText={touched.lastName && errors.lastName}
								fullWidth
								required
							/>
							<Field
								name="dob"
								component={DatePickerInput}
								label="Date of Birth"
								maxDate={moment().subtract(12, 'y')}
								required
							/>
							<Field
								name="skills"
								component={TechnologiesAutocomplete}
								label="Skills"
								id="select-skills-autocomplete"
								required
							/>
							<FormGroup>
								<FormControlLabel
									control={<Switch checked={values.isAvailable} />}
									label="Available for Hire"
									onChange={(e) => {
										setFieldValue('isAvailable', e.target.checked);
									}}
								/>
							</FormGroup>
							{values.isAvailable && (
								<FormControl
									required={values.isAvailable}
									error={errors.availability}
									component="fieldset"
									sx={{ m: 3 }}
									variant="standard"
									fullWidth
								>
									<FormLabel component="legend">Select Availability</FormLabel>
									<FormGroup>
										{AVAILABILITY.map((item) => (
											<FormControlLabel
												control={
													<Checkbox
														checked={values.availability.includes(item)}
														onChange={(e) => {
															if (e.target.checked)
																setFieldValue('availability', [
																	...values.availability,
																	item,
																]);
															else
																setFieldValue(
																	'availability',
																	values.availability.filter(
																		(selectedItem) => selectedItem !== item
																	)
																);
														}}
														name={item}
													/>
												}
												label={item}
											/>
										))}
									</FormGroup>
									{errors.availability && (
										<FormHelperText>{errors.availability}</FormHelperText>
									)}
								</FormControl>
							)}
							<TextField
								variant="outlined"
								label="GitHub"
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
								label="LinkedIn"
								name="linkedin"
								value={values.linkedin}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.linkedin && Boolean(errors.linkedin)}
								helperText={touched.linkedin && errors.linkedin}
								fullWidth
							/>
							<Stack direction="row" gap={2}>
								<Button type="button" onClick={cancel}>
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
						</Box>
					</Form>
				);
			}}
		</Formik>
	);
}

export default EditUserDetails;
