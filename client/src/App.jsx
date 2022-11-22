import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Alert from 'components/Alert';
import Routes from './routes';

function App() {
	return (
		<>
			<Router>
				<Routes />
			</Router>
			<Alert />
		</>
	);
}

export default App;
