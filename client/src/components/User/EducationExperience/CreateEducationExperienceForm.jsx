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
import moment from 'moment';
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
import {
	compareDateStr,
	deepEquality,
	isFutureDate,
	isValidDateStr,
} from 'utils/helpers';
import * as Yup from 'yup';

function CreateEducationExperienceForm({
	minFrom,
	primaryLabel = 'School',
	primaryKey = 'school',
	secondaryLabel = 'Course',
	secondaryKey = 'course',
	primaryValue = '',
	secondaryValue = '',
	primaryRegex = '^[a-zA-Z ]*$',
	primaryRegexErrMsg = 'Invalid School Name. Can only be letters',
	from = null,
	to = null,
	currentCheckboxLabel = 'I currently study here',
	cancel = () => {},
	submit = () => {},
	successMsg,
}) {
	const schema = Yup.object().shape({
		[primaryKey]: Yup.string()
			.required(`${primaryLabel} is required`)
			.min(3, `${primaryLabel} should be at least 3 characters`)
			.max(60, `${primaryLabel} cannot be greater than 60 characters`)
			.matches(primaryRegex, primaryRegexErrMsg),
		[secondaryKey]: Yup.string()
			.required(`${secondaryLabel} is required`)
			.min(3, `${secondaryLabel} should be at least 3 characters`)
			.max(60, `${secondaryLabel} cannot be greater than 60 characters`)
			.matches(
				'^[a-zA-Z0-9 ]*$',
				`Invalid ${secondaryLabel}. Can only be alpha numeric`
			),
		from: Yup.string().required('From date is required').nullable(),
		to: Yup.string().nullable(),
		isCurrent: Yup.boolean(),
	});
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
			validationSchema={schema}
			validate={(values) => {
				const errors = {};
				if (!values.from || values.from.trim().length === 0)
					errors.from = 'From date is required';
				if (values.from) {
					if (!isValidDateStr(values.from))
						errors.from = 'Invalid Date (MM-DD-YYYY expected)';
					else if (!compareDateStr(values.from, minFrom, 'after'))
						errors.from = 'From date cannot be before or same as your DOB';
					else if (isFutureDate(values.from))
						errors.from = 'From date cannot be in the future';
					else if (values.to && compareDateStr(values.from, values.to, 'after'))
						errors.from = 'From date cannot be after to date';
				}
				if (!values.isCurrent) {
					if (!values.to || values.to.trim().length === 0)
						errors.to = 'To date is required. Or check is current checkbox';
					if (values.to) {
						const compareDate =
							values.from && values.from.trim().length > 0 && !errors.from
								? {
										date: values.from,
										msg: 'To Date cannot be before or same as From date',
								  }
								: {
										date: minFrom,
										msg: 'To Date cannot be before or same as your DOB',
								  };
						if (!isValidDateStr(values.to))
							errors.to = 'Invalid Date (MM-DD-YYYY expected)';
						else if (!compareDateStr(values.to, compareDate.date, 'after'))
							errors.to = compareDate.msg;
						else if (isFutureDate(values.to))
							errors.from =
								'To date cannot be in the future. Choose current option if on-going';
					}
				}
				return errors;
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
							minDate={minFrom}
							maxDate={
								values.to
									? moment(values.to).subtract(1, 'days').format('MM-DD-YYYY')
									: undefined
							}
							required
						/>
						<Field
							name="to"
							component={DatePickerInput}
							label="To"
							minDate={values.from || minFrom}
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
							<Button
								type="submit"
								variant="contained"
								disabled={
									isSubmitting ||
									Object.keys(errors).length > 0 ||
									deepEquality(
										{
											[primaryKey]: values[primaryKey].trim(),
											[secondaryKey]: values[secondaryKey].trim(),
											from: values.from?.trim() ?? null,
											to: values.to?.trim() ?? null,
										},
										{
											[primaryKey]: primaryValue,
											[secondaryKey]: secondaryValue,
											from,
											to,
										}
									)
								}
							>
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
	dob,
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
			minFrom={moment(dob)}
		/>
	);
}

export function CreateExperienceForm({
	username,
	dob,
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
			primaryRegex="^[a-zA-Z0-9 ]*$"
			primaryRegexErrMsg="Invalid Company Name. Can only be letters or numbers"
			primaryValue={company}
			secondaryValue={title}
			from={from}
			to={to}
			minFrom={moment(dob)}
		/>
	);
}

export default CreateEducationExperienceForm;
