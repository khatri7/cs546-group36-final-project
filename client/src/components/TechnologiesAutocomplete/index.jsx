import { Autocomplete, Chip, FormControl, TextField } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { warningAlert } from 'store/alert';
import technologyTags from 'utils/data/technologyTags';

function TechnologiesAutocomplete({
	id,
	field,
	form: { setFieldValue, errors },
	label,
	required = false,
}) {
	const dispatch = useDispatch();
	return (
		<FormControl fullWidth>
			<Autocomplete
				multiple
				autoHighlight
				filterSelectedOptions
				fullWidth
				id={id}
				options={technologyTags}
				value={field.value}
				onChange={(event, value) => {
					if (value.length <= 10) setFieldValue(field.name, value);
					else dispatch(warningAlert(`You can only add upto 10 ${field.name}`));
				}}
				renderInput={(params) => {
					return (
						<TextField
							{...params}
							label={`${label}${required ? ' *' : ''}`}
							error={Boolean(errors[field.name])}
							helperText={errors[field.name] || ''}
						/>
					);
				}}
				renderTags={(value, getTagProps) =>
					value.map((tech, index) => (
						<Chip label={tech} {...getTagProps({ index })} />
					))
				}
				clearIcon={null}
			/>
		</FormControl>
	);
}

export default TechnologiesAutocomplete;
