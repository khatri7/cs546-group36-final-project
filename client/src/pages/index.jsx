import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import { increment, decrement } from 'store/counter';
import { NavLink } from 'react-router-dom';

function Home() {
	const count = useSelector((state) => state.counter.value);
	const dispatch = useDispatch();
	return (
		<div>
			<nav>
				<NavLink to="login">Login</NavLink>
				<NavLink to="Signup">Signup</NavLink>
			</nav>
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

export default Home;
