import {
	Avatar,
	Card,
	CardContent,
	Stack,
	Typography,
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
import {
	handleError,
	removeUserMedia,
	uploadAvatar,
	uploadResume,
} from 'utils/api-calls';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditUserDetails from './EditUserDetails';

function UserCard({
	_id,
	firstName,
	avatar,
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
	const [submittingAvatar, setSubmittingAvatar] = useState(false);
	const resumeRef = useRef(null);
	const avatarRef = useRef(null);
	const dispatch = useDispatch();
	const handleResumeUpload = useCallback(async (e) => {
		setSubmittingResume(true);
		const resumeFile = e.target.files[0];
		if (resumeFile) {
			if (resumeFile.type !== 'application/pdf') {
				e.target.value = '';
				dispatch(errorAlert('Resume needs to be of type pdf'));
			} else if (resumeFile.size > 5000000) {
				e.target.value = '';
				return dispatch(errorAlert('File size cannot be greater than 5MB'));
			} else {
				try {
					const res = await uploadResume(e.target.files[0], _id);
					if (!res.user) throw new Error();
					handleUpdateUser(res.user);
					dispatch(successAlert('Resume uploaded successfully'));
				} catch (err) {
					let error = 'Unexpected error occurred';
					if (typeof handleError(err) === 'string') error = handleError(err);
					dispatch(errorAlert(error));
				}
			}
		}
		e.target.value = '';
		setSubmittingResume(false);
		return true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const handleAvatarUpload = useCallback(async (e) => {
		setSubmittingAvatar(true);
		const avatarFile = e.target.files[0];
		if (avatarFile) {
			if (avatarFile.type !== 'image/jpeg' && avatarFile.type !== 'image/png') {
				e.target.value = '';
				dispatch(errorAlert('Avatar needs to be of type jpeg/png'));
			} else if (avatarFile.size > 5000000) {
				e.target.value = '';
				return dispatch(errorAlert('File size cannot be greater than 5MB'));
			} else {
				try {
					const res = await uploadAvatar(e.target.files[0], _id);
					if (!res.user) throw new Error();
					handleUpdateUser(res.user);
					dispatch(successAlert('Avatar uploaded successfully'));
				} catch (err) {
					let error = 'Unexpected error occurred';
					if (typeof handleError(err) === 'string') error = handleError(err);
					dispatch(errorAlert(error));
				}
			}
		}
		e.target.value = '';
		setSubmittingAvatar(false);
		return true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const handleRemoveMedia = async (mediaType, setLoading) => {
		try {
			setLoading(true);
			const res = await removeUserMedia(_id, mediaType);
			if (!res.user) throw new Error();
			handleUpdateUser(res.user);
			dispatch(successAlert(`${mediaType} removed successfully`));
		} catch (err) {
			let error = 'Unexpected error occurred';
			if (typeof handleError(err) === 'string') error = handleError(err);
			dispatch(errorAlert(error));
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (resumeRef.current)
			resumeRef.current.addEventListener('change', handleResumeUpload);
	}, [resumeRef, handleResumeUpload]);
	useEffect(() => {
		if (avatarRef.current)
			avatarRef.current.addEventListener('change', handleAvatarUpload);
	}, [avatarRef, handleAvatarUpload]);
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
					<Stack alignItems="center" spacing={1}>
						<Avatar
							src={avatar}
							alt={`${firstName} ${lastName}`}
							sx={{ width: 100, height: 100 }}
						/>
						{isCurrentUserProfile && !showEditProfile && (
							<Stack>
								<Button
									sx={{
										mt: -1,
									}}
									variant="text"
									size="small"
									component="label"
									aria-label="upload avatar"
									disabled={submittingAvatar}
								>
									{submittingAvatar ? (
										<CircularProgress size={16} />
									) : (
										'Upload/Update Avatar'
									)}
									<input
										ref={avatarRef}
										hidden
										accept="image/jpeg, image/png"
										type="file"
									/>
								</Button>
								{avatar && !submittingAvatar && (
									<Button
										type="button"
										color="error"
										size="small"
										sx={{
											m: 0,
										}}
										onClick={() => {
											handleRemoveMedia('avatar', setSubmittingAvatar);
										}}
									>
										Remove Avatar
									</Button>
								)}
							</Stack>
						)}
					</Stack>
					<Typography
						variant="h1"
						fontSize="2rem"
						sx={showEditProfile ? { display: 'none' } : {}}
					>
						{firstName} {lastName}
					</Typography>
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
										gap={1}
										sx={{
											marginTop: '0.5rem !important',
											flexWrap: 'wrap',
										}}
										justifyContent="center"
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
								gap={1}
								sx={{
									marginTop: '0.5rem !important',
									flexWrap: 'wrap',
								}}
								justifyContent="center"
							>
								{isAvailable && availability.length > 0 ? (
									availability.map((item) => <Chip label={item} key={item} />)
								) : (
									<Typography>Not looking for anything currently</Typography>
								)}
							</Stack>
							<Stack direction="row" spacing={2} alignItems="center">
								{socials.github && (
									<IconButton
										onClick={() => {
											window.open(socials.github, '_blank');
										}}
										color="inherit"
										component="label"
									>
										<GitHubIcon fontSize="large" />
									</IconButton>
								)}
								{socials.linkedin && (
									<IconButton
										onClick={() => {
											window.open(socials.linkedin, '_blank');
										}}
										color="inherit"
										component="label"
									>
										<LinkedInIcon fontSize="large" />
									</IconButton>
								)}
							</Stack>

							{isCurrentUserProfile && (
								<Stack direction="row" spacing={1}>
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
											`${resume ? 'Update' : 'Upload'} Resume`
										)}
										<input
											ref={resumeRef}
											hidden
											accept="application/pdf"
											type="file"
										/>
									</Button>
									{resume && !submittingResume && (
										<Button
											type="button"
											color="error"
											variant="outlined"
											onClick={() => {
												handleRemoveMedia('resume', setSubmittingResume);
											}}
										>
											Remove Resume
										</Button>
									)}
								</Stack>
							)}
							{resume && (
								<Button
									variant="contained"
									onClick={() => {
										window.open(resume, '_blank');
									}}
									startIcon={<OpenInNewIcon />}
								>
									Resume
								</Button>
							)}
						</>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}

export default UserCard;
