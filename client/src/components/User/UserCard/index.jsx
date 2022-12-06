import {
	Avatar,
	Card,
	CardContent,
	Stack,
	Typography,
	Link,
	Chip,
	Button,
	IconButton,
} from '@mui/material';
import React, { useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import EditIcon from '@mui/icons-material/Edit';
import EditUserDetails from './EditUserDetails';

function UserCard({
	firstName,
	lastName,
	username,
	dob,
	socials,
	skills,
	isCurrentUserProfile = false,
	handleUpdateUser,
}) {
	const [showEditProfile, setShowEditProfile] = useState(false);
	return (
		<Card sx={{ position: 'sticky', top: '5rem' }} raised>
			<CardContent>
				<Stack spacing={2} alignItems="center">
					{isCurrentUserProfile && (
						<IconButton
							aria-label="edit profile"
							sx={{ alignSelf: 'flex-end' }}
							onClick={() => {
								setShowEditProfile(true);
							}}
						>
							<EditIcon />
						</IconButton>
					)}
					<Avatar sx={{ width: 100, height: 100 }} />
					{showEditProfile ? (
						<EditUserDetails
							username={username}
							firstName={firstName}
							lastName={lastName}
							dob={dob}
							skills={skills}
							github={socials.github}
							linkedin={socials.linkedin}
							handleUpdateUser={handleUpdateUser}
							cancel={() => {
								setShowEditProfile(false);
							}}
						/>
					) : (
						<>
							<Typography variant="h1" fontSize="2rem">
								{firstName} {lastName}
							</Typography>
							<Typography
								variant="h2"
								fontSize="1.5rem"
								fontWeight="bold"
								sx={{
									marginTop: '0px !important',
								}}
							>
								@{username}
							</Typography>
							<Stack direction="row" spacing={1}>
								<CakeOutlinedIcon /> <Typography>{dob}</Typography>
							</Stack>
							{skills.length > 0 && (
								<>
									<Stack direction="row" spacing={1}>
										<WorkOutlineIcon /> <Typography>My skills are:</Typography>
									</Stack>
									<Stack
										direction="row"
										spacing={1}
										sx={{
											marginTop: '0.5rem !important',
										}}
									>
										{skills.map((skill) => (
											<Chip label={skill} key={skill} />
										))}
									</Stack>
								</>
							)}
							<Stack direction="row" spacing={2} alignItems="center">
								{socials.github && (
									<Link href={socials.github} target="_blank" color="inherit">
										<GitHubIcon fontSize="large" />
									</Link>
								)}
								{socials.linkedin && (
									<Link href={socials.linkedin} target="_blank" color="inherit">
										<LinkedInIcon fontSize="large" />
									</Link>
								)}
							</Stack>
							<Button variant="contained" size="large">
								Resume
							</Button>
						</>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}

export default UserCard;
