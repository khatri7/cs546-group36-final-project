import React from 'react';
import { FormControl, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

function DatePickerInput({
	field,
	form: { setFieldValue, errors },
	label,
	required,
}) {
	return (
		<FormControl fullWidth>
			<LocalizationProvider dateAdapter={AdapterMoment}>
				<DatePicker
					label={label}
					name={field.name}
					value={field.value}
					inputFormat="MM-DD-YYYY"
					onChange={(newValue) => {
						setFieldValue(
							field.name,
							newValue ? newValue.format('MM-DD-YYYY') : ''
						);
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							onBlur={field.handleBlur}
							error={Boolean(errors[field.name])}
							helperText={errors[field.name] || ''}
							required={required}
						/>
					)}
				/>
			</LocalizationProvider>
		</FormControl>
	);
}

export default DatePickerInput;
