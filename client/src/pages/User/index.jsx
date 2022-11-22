import { Box, Grid, Tabs, Tab } from '@mui/material';
import useQuery from 'hooks/useQuery';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import UserCard from './UserCard';
import TabPanel from './TabPanel';
import Profile from './Profile';
import Projects from './Projects';

function User() {
	const { username } = useParams();
	const { data, loading, error } = useQuery(`/users/${username}`);
	const [tabValue, setTabValue] = useState(0);
	if (error) return <p>error</p>;

	if (loading) return <p>loading...</p>;

	const { user } = data;

	const handleTabChange = (_e, newValue) => {
		setTabValue(newValue);
	};

	return (
		<Box>
			<Grid container spacing={2}>
				<Grid item xs={8}>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						aria-label="user profile tabs"
					>
						<Tab
							icon={<AccountCircleOutlinedIcon />}
							iconPosition="start"
							label="Profile"
							id="profile-tab"
							aria-controls="profile-tab"
						/>
						<Tab
							icon={<ScienceOutlinedIcon />}
							iconPosition="start"
							label="Projects"
							id="projects-tab"
							aria-controls="projects-tab"
						/>
					</Tabs>
					<TabPanel
						value={tabValue}
						tabId="profile-tab"
						tabAriaLabel="profile-tab"
						index={0}
					>
						<Profile />
					</TabPanel>
					<TabPanel
						value={tabValue}
						tabId="projects-tab"
						tabAriaLabel="projects-tab"
						index={1}
					>
						<Projects />
					</TabPanel>
				</Grid>
				<Grid item xs={4}>
					<UserCard
						firstName={user.firstName}
						lastName={user.lastName}
						username={user.username}
						dob={user.dob}
						socials={user.socials}
						skills={user.skills}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}

export default User;
