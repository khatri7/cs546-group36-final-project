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
	CircularProgress,
} from '@mui/material';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import EditIcon from '@mui/icons-material/Edit';
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { errorAlert, successAlert } from 'store/alert';
import { handleError, uploadResume } from 'utils/api-calls';
import EditUserDetails from './EditUserDetails';

function UserCard({
	_id,
	firstName,
	lastName,
	username,
	dob,
	socials,
	resume,
	skills = [],
	isAvailable,
	availability = [],
	isCurrentUserProfile = false,
	handleUpdateUser = () => {},
}) {
	const [showEditProfile, setShowEditProfile] = useState(false);
	const [submittingResume, setSubmittingResume] = useState(false);
	const resumeRef = useRef(null);
	const dispatch = useDispatch();
	const handleResumeUpload = useCallback(
		async (e) => {
			setSubmittingResume(true);
			const resumeFile = e.target.files[0];
			if (resumeFile) {
				if (resumeFile.type !== 'application/pdf') {
					e.target.value = '';
					dispatch(errorAlert('Resume needs to be of type pdf'));
				} else if (resumeFile.size > 5000000) {
					e.target.value = '';
					return dispatch(errorAlert('File size cannot be greater than 5MB'));
				} else dispatch(successAlert('Resume uploaded successfully'));
				try {
					const res = await uploadResume(e.target.files[0], _id);
					if (!res.user) throw new Error();
					handleUpdateUser(res.user);
				} catch (err) {
					let error = 'Unexpected error occurred';
					if (typeof handleError(err) === 'string') error = handleError(err);
					dispatch(errorAlert(error));
				}
			}
			e.target.value = '';
			setSubmittingResume(false);
			return true;
		},
		[dispatch, _id, handleUpdateUser]
	);
	useEffect(() => {
		if (resumeRef.current)
			resumeRef.current.addEventListener('change', handleResumeUpload);
	}, [resumeRef, handleResumeUpload]);
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
							<Stack direction="row" spacing={1}>
								{isCurrentUserProfile && (
									<Button
										variant="outlined"
										component="label"
										aria-label="upload resume"
										startIcon={<UploadRoundedIcon />}
										disabled={submittingResume}
									>
										{submittingResume ? (
											<CircularProgress size={16} />
										) : (
											'Upload Resume'
										)}
										<input
											ref={resumeRef}
											hidden
											accept="application/pdf"
											type="file"
										/>
									</Button>
								)}
								{resume && (
									<Button
										variant="contained"
										onClick={() => {
											window.open(resume, '_blank');
										}}
									>
										Resume
									</Button>
								)}
							</Stack>
						</>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}

export default UserCard;
