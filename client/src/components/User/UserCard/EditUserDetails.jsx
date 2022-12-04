import { Box, TextField } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import DatePickerInput from 'components/DatePicker';

const schema = Yup.object().shape({
	dob: Yup.string().required('').min(4),
	firstName: Yup.string().required('').min(4),
});

function EditUserDetails({ firstName, lastName, dob }) {
	return (
		<Formik
			initialValues={{
				firstName,
				lastName,
				dob,
			}}
			validationSchema={schema}
			enableReinitialize
		>
			{({
				values,
				errors,
				touched,
				handleChange,
				handleBlur,
				// eslint-disable-next-line no-unused-vars
				isSubmitting,
			}) => {
				return (
					<Form>
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
								required
							/>
						</Box>
					</Form>
				);
			}}
		</Formik>
	);
}

export default EditUserDetails;
