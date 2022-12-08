import { Autocomplete, Chip, FormControl, TextField } from '@mui/material';
import React from 'react';
import technologyTags from 'utils/data/technologyTags';

function TechnologiesAutocomplete({
	id,
	field,
	form: { setFieldValue, errors },
	label,
	required = false,
}) {
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
					setFieldValue(field.name, value);
				}}
				renderInput={(params) => {
					return (
						<TextField
							{...params}
							label={`${label}${required ? ' *' : ''}`}
							error={Boolean(errors.skills)}
							helperText={errors.skills || ''}
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
