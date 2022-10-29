import React from 'react';
import axios from 'axios';

function App() {
	return (
		<div>
			<button
				type="button"
				onClick={() => {
					axios.get(process.env.REACT_APP_SERVER_URL);
				}}
			>
				Click to make network request
			</button>
		</div>
	);
}

export default App;
