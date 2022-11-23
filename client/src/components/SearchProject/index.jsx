import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import { Autocomplete, Stack, TextField, InputAdornment } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import technologyTags from 'utils/data/technologyTags';

function SearchProject() {
	const [technologies, setTechnologies] = React.useState([]);

	const handleChange = (event, value) => {
		setTechnologies(value);
	};

	const handleDelete = (tech) => {
		setTechnologies(technologies.filter((technology) => technology !== tech));
	};

	return (
		<>
			<Box>
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
			<FormControl fullWidth sx={{ m: 1 }}>
				<Stack direction="row" gap={2}>
					<Autocomplete
						multiple
						autoHighlight
						filterSelectedOptions
						fullWidth
						id="select-technologies-autocomplete"
						options={technologyTags}
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
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchOutlinedIcon />
								</InputAdornment>
							),
						}}
						name="name"
						placeholder="Project Name"
					/>
				</Stack>
			</FormControl>
		</>
	);
}

export default SearchProject;
