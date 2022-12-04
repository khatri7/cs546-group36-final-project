import React from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

function DatePickerInput({
	field,
	form: { setFieldValue, touched, errors },
	label,
	required,
}) {
	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<DatePicker
				label={label}
				name={field.name}
				value={field.value}
				inputFormat="MM-DD-YYYY"
				onChange={(newValue) => {
					setFieldValue(field.name, newValue);
				}}
				renderInput={(params) => (
					<TextField
						onBlur={field.handleBlur}
						error={touched.dob && Boolean(errors.dob)}
						helperText={touched.dob && errors.dob}
						required={required}
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...params}
					/>
				)}
			/>
		</LocalizationProvider>
	);
}

export default DatePickerInput;
