import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Layout from 'components/Layout';
import Routes from './routes';

function App() {
	return (
		<Layout>
			<Routes />
		</Layout>
	);
}

export default App;
