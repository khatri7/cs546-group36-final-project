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
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import technologyTags from 'utils/data/technologyTags';

function SearchProject({ setEndpoint }) {
	const [technologies, setTechnologies] = useState([]);
	const [name, setName] = useState('');

	const handleChange = (event, value) => {
		setTechnologies(value);
	};

	const handleDelete = (tech) => {
		const updatedTechnologies = technologies.filter(
			(technology) => technology !== tech
		);
		setTechnologies(updatedTechnologies);
	};

	const handleSearch = () => {
		let endpoint = '/projects';
		if (name.trim() !== '' && technologies.length > 0)
			endpoint = `/projects?name=${name}&technologies=${String(technologies)}`;
		else if (name.trim() !== '') endpoint = `/projects?name=${name}`;
		else if (technologies.length > 0)
			endpoint = `/projects?technologies=${String(technologies)}`;
		setEndpoint(endpoint);
	};

	useEffect(() => {
		if (name.trim() === '' && technologies.length === 0)
			setEndpoint('/projects');
	}, [technologies.length, name, setEndpoint]);

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
							return <TextField {...params} label="Technologies" />;
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
						label="Project Name"
					/>
					<Button
						type="submit"
						variant="contained"
						sx={{ px: 4 }}
						onClick={handleSearch}
						disabled={name.trim() === '' && technologies.length === 0}
					>
						Search
					</Button>
				</Stack>
			</FormControl>
		</>
	);
}

export default SearchProject;
