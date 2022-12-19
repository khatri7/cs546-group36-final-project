import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	Grid,
	IconButton,
	Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useDispatch } from 'react-redux';
import { errorAlert, successAlert } from 'store/alert';
import {
	handleError,
	removeProjectMedia,
	uploadProjectImage,
} from 'utils/api-calls';

function UploadImageBtn({ position, projectId, handleUpdate }) {
	const [submitting, setSubmitting] = useState(false);
	const mediaBtnRef = useRef(null);
	const dispatch = useDispatch();
	const uploadImage = useCallback(async (e) => {
		setSubmitting(true);
		const mediaFile = e.target.files[0];
		if (mediaFile) {
			if (mediaFile.type !== 'image/jpeg' && mediaFile.type !== 'image/png') {
				e.target.value = '';
				dispatch(errorAlert('Image needs to be of type jpeg/png'));
			} else if (mediaFile.size > 5000000) {
				e.target.value = '';
				return dispatch(errorAlert('File size cannot be greater than 5MB'));
			} else {
				try {
					const res = await uploadProjectImage(
						e.target.files[0],
						position,
						projectId
					);
					if (!res.project) throw new Error();
					handleUpdate(res.project);
					dispatch(successAlert('Image uploaded successfully'));
				} catch (err) {
					let error = 'Unexpected error occurred';
					if (typeof handleError(err) === 'string') error = handleError(err);
					dispatch(errorAlert(error));
				}
			}
		}
		e.target.value = '';
		setSubmitting(false);
		return true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (mediaBtnRef.current)
			mediaBtnRef.current.addEventListener('change', uploadImage);
	}, [mediaBtnRef, uploadImage]);
	return (
		<Button
			sx={{
				border: (theme) => `2px dashed ${theme.palette.primary.main}`,
				width: '100%',
				height: '150px',
			}}
			component="label"
		>
			{submitting ? (
				<CircularProgress size={16} />
			) : (
				<AddIcon color="primary" />
			)}

			<input
				ref={mediaBtnRef}
				hidden
				accept="image/jpeg, image/png"
				type="file"
			/>
		</Button>
	);
}

function UploadProjectMedia({
	projectMedia = [],
	projectId,
	handleUpdate,
	close,
}) {
	const dispatch = useDispatch();
	return (
		<Box>
			<Grid container>
				{[0, 1, 2, 3, 4].map((position) => (
					<Grid item xs={6} sx={{ p: 1 }} key={position}>
						{projectMedia[position] ? (
							<Box
								sx={{
									height: '150px',
									position: 'relative',
								}}
							>
								<img
									src={projectMedia[position]}
									alt="project media"
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
									}}
								/>
								<IconButton
									aria-label="delete image"
									sx={{
										position: 'absolute',
										top: -8,
										right: -8,
										background: 'white',
										p: 0.2,
										':hover': {
											background: 'white',
										},
									}}
									onClick={async () => {
										try {
											const res = await removeProjectMedia(position, projectId);
											if (!res.project) throw new Error();
											handleUpdate(res.project);
											dispatch(successAlert('Image removed successfully'));
										} catch (err) {
											let error = 'Unexpected error occurred';
											if (typeof handleError(err) === 'string')
												error = handleError(err);
											dispatch(errorAlert(error));
										}
									}}
								>
									<CancelRoundedIcon size="large" color="white" />
								</IconButton>
							</Box>
						) : (
							<UploadImageBtn
								position={position}
								projectId={projectId}
								handleUpdate={handleUpdate}
							/>
						)}
					</Grid>
				))}
			</Grid>
			<Stack justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
				<Button type="button" variant="contained" onClick={close}>
					Done
				</Button>
			</Stack>
		</Box>
	);
}

export default UploadProjectMedia;
