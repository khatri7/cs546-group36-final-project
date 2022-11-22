import React from 'react';
import { Box } from '@mui/material';

function TabPanel({ children, value, tabId, tabAriaLabel, index }) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={tabId}
			aria-labelledby={tabAriaLabel}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

export default TabPanel;
