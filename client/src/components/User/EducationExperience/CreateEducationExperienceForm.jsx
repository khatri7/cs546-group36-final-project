import {
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	Stack,
	TextField,
} from '@mui/material';
import DatePickerInput from 'components/DatePicker';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { errorAlert, successAlert } from 'store/alert';
import {
	createEducation,
	createExperience,
	handleError,
	updateEducation,
	updateExperience,
} from 'utils/api-calls';

function CreateEducationExperienceForm({
	primaryLabel = 'School',
	primaryKey = 'school',
	secondaryLabel = 'Course',
	secondaryKey = 'course',
	primaryValue = '',
	secondaryValue = '',
	from = null,
	to = null,
	currentCheckboxLabel = 'I currently study here',
	cancel = () => {},
	submit = () => {},
	successMsg,
}) {
	const dispatch = useDispatch();
	return (
		<Formik
			initialValues={{
				[primaryKey]: primaryValue,
				[secondaryKey]: secondaryValue,
				from,
				to,
				isCurrent: Boolean(to === null),
			}}
			enableReinitialize
			onSubmit={async (values, { setSubmitting }) => {
				try {
					setSubmitting(true);
					const submitObj = { ...values };
					if (values.isCurrent) submitObj.to = null;
					delete submitObj.isCurrent;
					await submit(submitObj);
					if (successMsg) dispatch(successAlert(successMsg));
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
				setFieldValue,
				isSubmitting,
			}) => (
				<Form>
					<Stack spacing={2}>
						<TextField
							variant="outlined"
							label={primaryLabel}
							name={primaryKey}
							value={values[primaryKey]}
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched[primaryKey] && Boolean(errors[primaryKey])}
							helperText={touched[primaryKey] && errors[primaryKey]}
							fullWidth
							required
						/>
						<TextField
							variant="outlined"
							label={secondaryLabel}
							name={secondaryKey}
							value={values[secondaryKey]}
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched[secondaryKey] && Boolean(errors[secondaryKey])}
							helperText={touched[secondaryKey] && errors[secondaryKey]}
							fullWidth
							required
						/>
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox
										inputProps={{ 'aria-label': currentCheckboxLabel }}
										checked={values.isCurrent}
										onChange={(e) => {
											setFieldValue('isCurrent', e.target.checked);
										}}
									/>
								}
								label={currentCheckboxLabel}
							/>
						</FormGroup>
						<Field
							name="from"
							component={DatePickerInput}
							label="From"
							required
						/>
						<Field
							name="to"
							component={DatePickerInput}
							label="To"
							disabled={values.isCurrent}
							required
						/>
						<Stack
							direction="row"
							spacing={2}
							sx={{
								alignSelf: 'flex-end',
							}}
						>
							<Button type="button" onClick={cancel}>
								Cancel
							</Button>
							<Button type="submit" variant="contained" disabled={isSubmitting}>
								{isSubmitting ? <CircularProgress /> : 'Save'}
							</Button>
						</Stack>
					</Stack>
				</Form>
			)}
		</Formik>
	);
}

export function CreateEducationForm({
	username,
	_id,
	school,
	course,
	from,
	to,
	cancel,
	handleUpdateUser = () => {},
	isUpdateForm = false,
}) {
	const onSubmit = async (experieceObj) => {
		let resp;
		if (isUpdateForm) resp = await updateEducation(username, experieceObj, _id);
		else resp = await createEducation(username, experieceObj);
		if (!resp.user) throw new Error();
		handleUpdateUser(resp.user);
		cancel();
	};
	return (
		<CreateEducationExperienceForm
			submit={onSubmit}
			cancel={cancel}
			successMsg={
				isUpdateForm
					? 'Education updated successfully'
					: 'Education added successfully'
			}
			primaryValue={school}
			secondaryValue={course}
			from={from}
			to={to}
		/>
	);
}

export function CreateExperienceForm({
	username,
	_id,
	company,
	title,
	from,
	to,
	cancel,
	handleUpdateUser = () => {},
	isUpdateForm = false,
}) {
	const onSubmit = async (experieceObj) => {
		let resp;
		if (isUpdateForm)
			resp = await updateExperience(username, experieceObj, _id);
		else resp = await createExperience(username, experieceObj);
		if (!resp.user) throw new Error();
		handleUpdateUser(resp.user);
		cancel();
	};
	return (
		<CreateEducationExperienceForm
			primaryLabel="Company"
			primaryKey="company"
			secondaryLabel="Title"
			secondaryKey="title"
			currentCheckboxLabel="I currently work here"
			submit={onSubmit}
			cancel={cancel}
			successMsg={
				isUpdateForm
					? 'Experience updated successfully'
					: 'Experience added successfully'
			}
			primaryValue={company}
			secondaryValue={title}
			from={from}
			to={to}
		/>
	);
}

export default CreateEducationExperienceForm;
