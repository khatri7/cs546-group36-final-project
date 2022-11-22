import { Container } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';

import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	// eslint-disable-next-line react/jsx-filename-extension
	<React.StrictMode>
		<Provider store={store}>
			<Container>
				<App />
			</Container>
		</Provider>
	</React.StrictMode>
);
