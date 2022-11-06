import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import { decrement, increment } from './store/counter';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
	const count = useSelector((state) => state.counter.value);
	const dispatch = useDispatch();
	return (
		<div>
			<Button
				type="button"
				variant="contained"
				sx={{
					mb: 2,
				}}
				onClick={() => {
					axios.get(process.env.REACT_APP_SERVER_URL);
				}}
			>
				Click to make network request
			</Button>
			<div>
				<Button
					variant="outlined"
					type="button"
					aria-label="Decrement value"
					onClick={() => dispatch(decrement())}
				>
					Decrement
				</Button>
				<span style={{ margin: '0 1rem' }}>{count}</span>
				<Button
					variant="outlined"
					type="button"
					aria-label="Increment value"
					onClick={() => dispatch(increment())}
				>
					Increment
				</Button>
			</div>
		</div>
	);
}

export default App;
