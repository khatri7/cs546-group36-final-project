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
	InputLabel,
	Select,
	MenuItem,
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
	const handleStatusChange = (event) => {
		setStatus(event.target.value);
	};

	const handleDelete = (tech) => {
		const updatedTechnologies = technologies.filter(
			(technology) => technology !== tech
		);
		setTechnologies(updatedTechnologies);
	};

	const handleSearch = () => {
		const queryParams = [];
		if (name.trim() !== '') queryParams.push(`name=${name.trim()}`);
		if (technologies.length > 0)
			queryParams.push(`technologies=${String(technologies)}`);
		if (status !== 'all') queryParams.push(`status=${status}`);
		setEndpoint(
			`/ideas${queryParams.length === 0 ? '' : `?${queryParams.join('&')}`}`
		);
	};

	useEffect(() => {
		if (
			name.trim() === '' &&
			technologies.length === 0 &&
			status.trim() === 'all'
		)
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

					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Status</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={status}
							label="status"
							onChange={handleStatusChange}
						>
							<MenuItem value="inactive">inactive</MenuItem>
							<MenuItem value="active">active</MenuItem>
							<MenuItem value="all">all</MenuItem>
						</Select>
					</FormControl>
					<Button
						type="submit"
						variant="contained"
						sx={{ px: 4 }}
						onClick={handleSearch}
						disabled={
							name.trim() === '' &&
							technologies.length === 0 &&
							status === 'all'
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
