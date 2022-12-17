import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import {
	Autocomplete,
	Stack,
	TextField,
	Button,
	Select,
	MenuItem,
	InputLabel,
	IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import skillsTags from 'utils/data/technologyTags';

function SearchUser({ setEndpoint }) {
	const [skills, setSkills] = useState([]);
	const [availability, setAvailability] = useState('');

	const handleSkillsChange = (event, value) => {
		setSkills(value);
	};
	const handleAvailabilityChange = (event) => {
		setAvailability(event.target.value);
	};
	const handleAvailabilityClear = () => {
		setAvailability('');
	};

	const handleDelete = (tech) => {
		const updatedSkills = skills.filter((skill) => skill !== tech);
		setSkills(updatedSkills);
	};

	const handleSearch = () => {
		let endpoint = '/hiring';
		if (skills.length > 0 && availability.length > 0)
			endpoint = `/hiring?skills=${String(skills)}&availability=${String(
				availability
			)}`;
		else if (skills.length > 0) endpoint = `/hiring?skills=${String(skills)}`;
		else if (availability.length > 0)
			endpoint = `/hiring?availability=${String(availability)}`;
		setEndpoint(endpoint);
	};

	useEffect(() => {
		if (skills.length === 0 && availability.length === 0)
			setEndpoint('/hiring');
	}, [skills.length, availability.length, setEndpoint]);

	return (
		<>
			<Box mb={2}>
				<Stack direction="row" spacing={1}>
					{skills.map((skill) => (
						<Chip
							label={skill}
							onDelete={() => {
								handleDelete(skill);
							}}
							key={skill}
						/>
					))}
				</Stack>
			</Box>
			<FormControl fullWidth>
				<Stack direction="row" gap={2}>
					<Autocomplete
						multiple
						autoHighlight
						filterSelectedOptions
						fullWidth
						id="select-technologies-autocomplete"
						options={skillsTags}
						value={skills}
						onChange={handleSkillsChange}
						renderInput={(params) => {
							return <TextField {...params} label="Skills" />;
						}}
						renderTags={() => {}}
						clearIcon={null}
					/>
					<FormControl fullWidth>
						<InputLabel id="select-label">Availability</InputLabel>
						<Select
							labelId="select-label"
							value={availability}
							label="Availability"
							onChange={handleAvailabilityChange}
							endAdornment={
								<IconButton
									sx={{ display: availability ? '' : 'none' }}
									onClick={handleAvailabilityClear}
								>
									<ClearIcon />
								</IconButton>
							}
						>
							<MenuItem value="full-time">full-time</MenuItem>
							<MenuItem value="part-time">part-time</MenuItem>
							<MenuItem value="contract">contract</MenuItem>
							<MenuItem value="internship">internship</MenuItem>
							<MenuItem value="code-collab">code-collab</MenuItem>
						</Select>
					</FormControl>
					<Button
						type="submit"
						variant="contained"
						sx={{ px: 4 }}
						onClick={handleSearch}
						disabled={skills.length === 0 && availability.length === 0}
					>
						Search
					</Button>
				</Stack>
			</FormControl>
		</>
	);
}
export default SearchUser;
