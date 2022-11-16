import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';
import {
	Button,
	TextField,
	Box,
	Typography,
	CircularProgress,
	InputAdornment,
	IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { handleError, login } from 'utils/api-calls';
import { useDispatch } from 'react-redux';
import { errorAlert } from 'store/alert';

// Creating schema
const schema = Yup.object().shape({
	username: Yup.string()
		.required('Username is required')
		.matches('^[a-zA-Z][a-zA-Z0-9]*$', 'Invalid username')
		.min(3, 'Username must be at least 3 characters'),
	password: Yup.string()
		.required('Password is required')
		.min(8, 'Password must be at least 8 characters'),
});

function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const dispatch = useDispatch();

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	return (
		<Formik
			validationSchema={schema}
			initialValues={{ username: '', password: '' }}
			onSubmit={async (values, { setSubmitting }) => {
				try {
					setSubmitting(true);
					await login(values);
				} catch (e) {
					let error = 'Unexpected error occurred';
					if (typeof handleError(e) === 'string') error = handleError(e);
					dispatch(errorAlert(error));
				} finally {
					setSubmitting(false);
				}
			}}
		>
			{({
				values,
				errors,
				touched,
				handleChange,
				handleBlur,
				isSubmitting,
			}) => (
				<Form>
					<Box
						sx={{
							height: '100vh',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography variant="h3" sx={{ mb: 2, textTransform: 'uppercase' }}>
							Login
						</Typography>
						<TextField
							variant="outlined"
							label="Username"
							name="username"
							value={values.username}
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched.username && Boolean(errors.username)}
							helperText={touched.username && errors.username}
							sx={{
								minWidth: 500,
								mb: 2,
							}}
							required
						/>
						<TextField
							variant="outlined"
							label="Password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							value={values.password}
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched.password && Boolean(errors.password)}
							helperText={touched.password && errors.password}
							sx={{
								minWidth: 500,
								mb: 2,
							}}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
							required
						/>
						<Button
							variant="contained"
							type="submit"
							sx={{
								height: '3rem',
								width: '10rem',
							}}
							disabled={
								!!(
									isSubmitting ||
									!values.username ||
									!values.password ||
									errors.username ||
									errors.password
								)
							}
						>
							{isSubmitting ? <CircularProgress size={24} /> : 'Login'}
						</Button>
					</Box>
				</Form>
			)}
		</Formik>
	);
}

export default LoginForm;
