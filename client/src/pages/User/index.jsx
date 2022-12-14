import { Box, Grid, Tabs, Tab, Typography } from '@mui/material';
import useQuery from 'hooks/useQuery';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import UserCard from 'components/User/UserCard';
import TabPanel from 'components/User/TabPanel';
import Profile from 'components/User/Profile';
import Projects from 'components/User/Projects';
import { useDispatch, useSelector } from 'react-redux';
import SavedProjects from 'components/User/SavedProjects';
import { setUser as setReduxUser } from 'store/user';

function User() {
	const { username } = useParams();
	const dispatch = useDispatch();
	const { data, loading, error } = useQuery(`/users/${username}`);
	const [tabValue, setTabValue] = useState(0);
	const [user, setUser] = useState(data?.user ?? null);

	const currentUser = useSelector((state) => state.user);

	useEffect(() => {
		if (data?.user) setUser(data.user);
	}, [data]);

	if (error) return <Typography>{error}</Typography>;

	if (loading) return <Typography>Loading...</Typography>;

	if (!user) return <Typography>Error getting user</Typography>;

	const isCurrentUserProfile = Boolean(
		currentUser && currentUser._id === user._id
	);

	const handleUpdateUser = (updatedUserObj) => {
		setUser(updatedUserObj);
		if (isCurrentUserProfile) {
			const { _id, firstName, lastName, avatar } = updatedUserObj;
			dispatch(
				setReduxUser({
					_id,
					username: updatedUserObj.username,
					firstName,
					lastName,
					avatar,
				})
			);
		}
	};

	const handleTabChange = (_e, newValue) => {
		setTabValue(newValue);
	};

	return (
		<Box>
			<Grid container spacing={2}>
				<Grid item xs={4}>
					<UserCard
						_id={user._id}
						firstName={user.firstName}
						lastName={user.lastName}
						username={user.username}
						avatar={user.avatar}
						dob={user.dob}
						socials={user.socials}
						skills={user.skills}
						isAvailable={user.isAvailable}
						availability={user.availability}
						resume={user.resumeUrl}
						isCurrentUserProfile={isCurrentUserProfile}
						handleUpdateUser={handleUpdateUser}
					/>
				</Grid>
				<Grid sx={{ order: -1 }} item xs={8}>
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
							aria-controls="profile-tabpanel"
						/>
						<Tab
							icon={<ScienceOutlinedIcon />}
							iconPosition="start"
							label="Projects"
							id="projects-tab"
							aria-controls="projects-tabpanel"
						/>
						{isCurrentUserProfile && (
							<Tab
								icon={<BookmarksOutlinedIcon />}
								iconPosition="start"
								label="Saved Projects"
								id="saved-projects-tab"
								aria-controls="saved-projects-tabpanel"
							/>
						)}
					</Tabs>
					<TabPanel
						value={tabValue}
						tabId="profile-tabpanel"
						tabAriaLabel="profile-tabpanel"
						index={0}
					>
						<Profile
							username={username}
							dob={user.dob}
							bio={user.bio}
							education={user.education}
							experience={user.experience}
							isCurrentUserProfile={isCurrentUserProfile}
							handleUpdateUser={handleUpdateUser}
						/>
					</TabPanel>
					<TabPanel
						value={tabValue}
						tabId="projects-tabpanel"
						tabAriaLabel="projects-tabpanel"
						index={1}
					>
						<Projects username={user.username} />
					</TabPanel>
					<TabPanel
						value={tabValue}
						tabId="saved-projects-tabpanel"
						tabAriaLabel="saved-projects-tabpanel"
						index={2}
					>
						<SavedProjects username={user.username} />
					</TabPanel>
				</Grid>
			</Grid>
		</Box>
	);
}

export default User;
