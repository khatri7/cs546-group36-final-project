import React, { useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	Divider,
	IconButton,
	Stack,
	Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {
	deleteEducation,
	deleteExperience,
	handleError,
} from 'utils/api-calls';
import { useDispatch, useSelector } from 'react-redux';
import { errorAlert, successAlert } from 'store/alert';
import {
	CreateEducationForm,
	CreateExperienceForm,
} from './CreateEducationExperienceForm';

function EducationExperiece({
	username,
	cardTitle,
	titleKey,
	subtitleKey,
	array = [],
	isCurrentUserProfile = false,
	Form,
	handleUpdateUser = () => {},
	deleteFn = () => {},
}) {
	const [showAddEducationExperienceForm, setShowEducationExperienceForm] =
		useState(false);
	const [showEditForm, setShowEditForm] = useState(null);
	const dispatch = useDispatch();
	return (
		<Card
			sx={{
				marginTop: 2,
			}}
			raised
		>
			<CardContent>
				<Stack direction="row" justifyContent="space-between">
					<Typography variant="h4" component="h2">
						{cardTitle}
					</Typography>
					{isCurrentUserProfile && (
						<IconButton
							aria-label={`add ${cardTitle}`}
							sx={{ alignSelf: 'flex-end' }}
							onClick={() => {
								setShowEducationExperienceForm(true);
							}}
						>
							<AddIcon />
						</IconButton>
					)}
				</Stack>
				{showAddEducationExperienceForm && Boolean(Form) && Boolean(username) && (
					<Box sx={{ py: 2 }}>
						<Form
							username={username}
							cancel={() => {
								setShowEducationExperienceForm(false);
							}}
							handleUpdateUser={handleUpdateUser}
						/>
					</Box>
				)}
				<Box>
					{array.map((item, index) => (
						<Box key={item._id}>
							<Box py={2}>
								{showEditForm === item._id ? (
									<Form
										username={username}
										handleUpdateUser={handleUpdateUser}
										cancel={() => {
											setShowEditForm(null);
										}}
										isUpdateForm
										{...item}
									/>
								) : (
									<>
										<Stack direction="row" justifyContent="space-between">
											<Typography variant="h5" component="h3">
												{item[titleKey]}
											</Typography>
											{isCurrentUserProfile && (
												<Stack
													direction="row"
													spacing={1}
													sx={{ alignSelf: 'flex-end' }}
												>
													<IconButton
														aria-label={`delete ${cardTitle}`}
														onClick={async () => {
															try {
																await deleteFn(item._id);
																dispatch(
																	successAlert(
																		`${cardTitle} deleted successfully`
																	)
																);
															} catch (e) {
																let error = 'Unexpected error occurred';
																if (typeof handleError(e) === 'string')
																	error = handleError(e);
																dispatch(errorAlert(error));
															}
														}}
													>
														<DeleteRoundedIcon
															fontSize="small"
															sx={{ py: 0 }}
														/>
													</IconButton>
													<IconButton
														aria-label={`edit ${cardTitle}`}
														onClick={() => {
															setShowEditForm(item._id);
														}}
													>
														<EditIcon fontSize="small" sx={{ py: 0 }} />
													</IconButton>
												</Stack>
											)}
										</Stack>
										<Typography>{item[subtitleKey]}</Typography>
										<Typography
											sx={{
												fontSize: '14px',
												color: '#00000099',
											}}
										>
											{item.from} - {item.to || 'now'}
										</Typography>
									</>
								)}
							</Box>
							{index < array.length - 1 && <Divider />}
						</Box>
					))}
				</Box>
			</CardContent>
		</Card>
	);
}

export function Education({
	username,
	education = [],
	isCurrentUserProfile = false,
	handleUpdateUser = () => {},
}) {
	const token = useSelector((state) => state.user?.token);
	const deleteFn = async (educationId) => {
		const res = await deleteEducation(username, educationId, token);
		if (!res.user) throw new Error();
		handleUpdateUser(res.user);
	};
	return (
		<EducationExperiece
			username={username}
			cardTitle="Education"
			titleKey="school"
			subtitleKey="course"
			array={education}
			isCurrentUserProfile={isCurrentUserProfile}
			Form={CreateEducationForm}
			handleUpdateUser={handleUpdateUser}
			deleteFn={deleteFn}
		/>
	);
}

export function Experience({
	username,
	experiece = [],
	isCurrentUserProfile = false,
	handleUpdateUser = () => {},
}) {
	const token = useSelector((state) => state.user?.token);
	const deleteFn = async (experieceId) => {
		const res = await deleteExperience(username, experieceId, token);
		if (!res.user) throw new Error();
		handleUpdateUser(res.user);
	};
	return (
		<EducationExperiece
			username={username}
			cardTitle="Experience"
			titleKey="company"
			subtitleKey="title"
			array={experiece}
			isCurrentUserProfile={isCurrentUserProfile}
			Form={CreateExperienceForm}
			handleUpdateUser={handleUpdateUser}
			deleteFn={deleteFn}
		/>
	);
}
