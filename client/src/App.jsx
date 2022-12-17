import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Layout from 'components/Layout';
import { createTheme, ThemeProvider } from '@mui/material';
import Routes from './routes';

const theme = createTheme({
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					'&.Mui-disabled': {
						':disabled': {
							color: '#5c5c5c',
						},
					},
				},
			},
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Layout>
				<Routes />
			</Layout>
		</ThemeProvider>
	);
}

export default App;
