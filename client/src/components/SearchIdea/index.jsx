import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import {
	Autocomplete,
	Stack,
	TextField,
	InputAdornment,
	Button,
	FormLabel,
	RadioGroup,
	Radio,
	FormControlLabel,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import technologyTags from 'utils/data/technologyTags';

function SearchIdea({ setEndpoint }) {
	const [technologies, setTechnologies] = useState([]);
	const [status, setStatus] = useState('all');
	const [name, setName] = useState('');

	const handleChange = (event, value) => {
		setTechnologies(value);
	};
	const handleStatusChange = (event, value) => {
		setStatus(value);
	};

	const handleDelete = (tech) => {
		const updatedTechnologies = technologies.filter(
			(technology) => technology !== tech
		);
		setTechnologies(updatedTechnologies);
	};

	const handleSearch = () => {
		let endpoint = '/ideas';
		if (name.trim() !== '' && technologies.length > 0 && status.length > 0)
			endpoint = `/ideas?name=${name}&technologies=${String(
				technologies
			)}&status=${String(status)}`;
		else if (name.trim() !== '') endpoint = `/ideas?name=${name}`;
		else if (technologies.length > 0)
			endpoint = `/ideas?technologies=${String(technologies)}`;
		else if (status !== 'all') endpoint = `/ideas?status=${String(status)}`;
		setEndpoint(endpoint);
	};

	useEffect(() => {
		if (name.trim() === '' && technologies.length === 0 && status.trim() === '')
			setEndpoint('/ideas');
	}, [technologies.length, name, status, setEndpoint]);

	return (
		<>
			<Box mb={2}>
				<Stack direction="row" spacing={1}>
					{technologies.map((technology) => (
						<Chip
							label={technology}
							onDelete={() => {
								handleDelete(technology);
							}}
							key={technology}
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
						options={technologyTags}
						value={technologies}
						onChange={handleChange}
						renderInput={(params) => {
							// eslint-disable-next-line react/jsx-props-no-spreading
							return <TextField {...params} placeholder="Technologies" />;
						}}
						renderTags={() => {}}
						clearIcon={null}
					/>
					<FormLabel id="demo-controlled-radio-buttons-group">Status</FormLabel>
					<RadioGroup
						aria-labelledby="demo-controlled-radio-buttons-group"
						name="controlled-radio-buttons-group"
						value={status}
						onChange={handleStatusChange}
					>
						<FormControlLabel
							value="inactive"
							control={<Radio />}
							label="Inactive"
						/>
						<FormControlLabel
							value="active"
							control={<Radio />}
							label="Active"
						/>
						<FormControlLabel value="all" control={<Radio />} label="All" />
					</RadioGroup>
					<TextField
						fullWidth
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchOutlinedIcon />
								</InputAdornment>
							),
						}}
						name="name"
						placeholder="Idea Name"
					/>
					<Button
						type="submit"
						variant="contained"
						sx={{ px: 4 }}
						onClick={handleSearch}
						disabled={
							name.trim() === '' &&
							technologies.length === 0 &&
							status.length === 0
						}
					>
						Search
					</Button>
				</Stack>
			</FormControl>
		</>
	);
}

export default SearchIdea;
