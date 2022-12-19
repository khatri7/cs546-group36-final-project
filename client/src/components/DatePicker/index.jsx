import React from 'react';
import { FormControl, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

function DatePickerInput({
	field,
	form: { setFieldValue, errors },
	label,
	disabled = false,
	minDate,
	maxDate,
	required,
}) {
	return (
		<FormControl fullWidth>
			<LocalizationProvider dateAdapter={AdapterMoment}>
				<DatePicker
					label={label}
					disabled={disabled}
					name={field.name}
					value={field.value}
					inputFormat="MM-DD-YYYY"
					minDate={minDate || moment().subtract(100, 'y')}
					maxDate={maxDate || moment()}
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
