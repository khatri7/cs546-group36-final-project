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
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import EditUserDetails from './EditUserDetails';

function UserCard({
	firstName,
	lastName,
	username,
	dob,
	socials,
	skills,
	isAvailable,
	availability,
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
							isAvailable={isAvailable}
							availability={availability}
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
								fontSize="1.2rem"
								sx={{
									marginTop: '0px !important',
								}}
							>
								@{username}
							</Typography>
							<Stack direction="row" spacing={1}>
								<CakeOutlinedIcon />
								<Typography textAlign="center">
									Date of Birth: {moment(dob).format('MMMM Do, YYYY')}
								</Typography>
							</Stack>
							{skills.length > 0 && (
								<>
									<Stack direction="row" spacing={1}>
										<HandymanOutlinedIcon />
										<Typography>My skills are:</Typography>
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
							<Stack direction="row" spacing={1}>
								<WorkOutlineIcon />
								<Typography>I am available for:</Typography>
							</Stack>
							<Stack
								direction="row"
								spacing={1}
								sx={{
									marginTop: '0.5rem !important',
								}}
							>
								{isAvailable && availability.length > 0 ? (
									availability.map((item) => <Chip label={item} key={item} />)
								) : (
									<Typography>Not looking for anything currently</Typography>
								)}
							</Stack>
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
