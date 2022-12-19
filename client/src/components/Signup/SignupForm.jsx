import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import DatePickerInput from 'components/DatePicker';
import TechnologiesAutocomplete from 'components/TechnologiesAutocomplete';
import { Formik, Form, Field } from 'formik';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { errorAlert, successAlert } from 'store/alert';
import { setUser } from 'store/user';
import {
	checkUsernameAvailable,
	createUser,
	handleError,
} from 'utils/api-calls';
import { isValidDateStr, isValidDob, isValidSkills } from 'utils/helpers';
import * as Yup from 'yup';

const schema = Yup.object().shape({
	firstName: Yup.string()
		.required('First name is required')
		.matches('^[a-zA-Z]*$', 'Invalid First name')
		.min(3, 'First name must be atleast 3 cahracters')
		.max(40, 'First name cannot be greater than 40 cahracters'),
	lastName: Yup.string()
		.required('Last name is required')
		.matches('^[a-zA-Z]*$', 'Invalid Last name')
		.min(3, 'Last name must be atleast 3 characters')
		.max(40, 'Last name cannot be greater than 40 cahracters'),
	username: Yup.string()
		.required('Username is required')
		.matches('^[a-zA-Z][a-zA-Z0-9]*$', 'Invalid username')
		.min(3, 'Username must be at least 3 characters')
		.max(20, 'Username cannot be greater than 20 cahracters'),
	dob: Yup.string('Invalid DOB').required('DOB is required'),
	email: Yup.string().required('Email is required').email('Invalid email'),
	password: Yup.string()
		.required('Password is required')
		.min(8, 'Password must be at least 8 characters'),
	github: Yup.string().matches(
		'^(http(s?)://)?(www.)?github.com/(?:[-a-zA-Z0-9()@:%_+.~#?&/=]{1,})/?$',
		'Invalid GitHub URL'
	),
	linkedin: Yup.string().matches(
		'^(http(s?)://)?(www.)?linkedin.com/(pub|in|profile)/(?:[-a-zA-Z0-9()@:%_+.~#?&/=]{1,})/?$',
		'Invalid LinkedIn URL'
	),
});

function SignupForm() {
	const [showPassword, setShowPassword] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const isUsernameAvailable = async (username) => {
		try {
			await checkUsernameAvailable(username);
			return true;
		} catch (e) {
			return false;
		}
	};
	return (
		<Box
			sx={{
				minHeight: '60vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 4,
			}}
		>
			<Formik
				initialValues={{
					firstName: '',
					lastName: '',
					username: '',
					email: '',
					password: '',
					dob: '',
					github: '',
					linkedin: '',
					skills: [],
				}}
				validationSchema={schema}
				validate={async (values) => {
					const errors = {};
					if (!isValidDateStr(values.dob)) errors.dob = 'Invalid DOB';
					if (!isValidDob(values.dob))
						errors.dob = 'Invalid DOB: Should be between 12-100 years in age';
					if (!values.skills || values.skills.length < 1)
						errors.skills = 'Need to mention at least one skill';
					else if (values.skills.length > 10)
						errors.skills = 'You can only add upto 10 skills';
					if (!isValidSkills(values.skills)) errors.skills = 'Invalid skills';
					if (values.skills.length > 10)
						errors.skills = 'You can add up to 10 skills';
					return errors;
				}}
				onSubmit={async (values, { setSubmitting, setFieldError }) => {
					try {
						setSubmitting(true);
						if (!(await isUsernameAvailable(values.username)))
							setFieldError('username', 'Username is not available');
						else {
							const userObj = { ...values };
							delete userObj.github;
							delete userObj.linkedin;
							userObj.socials = {
								github: values.github.length === 0 ? null : values.github,
								linkedin: values.linkedin.length === 0 ? null : values.linkedin,
							};
							const resp = await createUser(userObj);
							if (!resp.user) throw new Error();
							dispatch(setUser(resp.user));
							navigate(`/users/${resp.user.username}`);
							dispatch(successAlert('Account created successfully'));
						}
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
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 2,
								minWidth: '500px',
							}}
						>
							<Typography
								variant="h3"
								component="h1"
								sx={{ textTransform: 'uppercase' }}
							>
								Sign Up
							</Typography>
							<Stack
								direction="row"
								spacing={2}
								sx={{
									width: '100%',
								}}
							>
								<TextField
									variant="outlined"
									label="First Name"
									name="firstName"
									value={values.firstName}
									onChange={handleChange}
									onBlur={handleBlur}
									error={touched.firstName && Boolean(errors.firstName)}
									helperText={touched.firstName && errors.firstName}
									fullWidth
									required
								/>
								<TextField
									variant="outlined"
									label="Last Name"
									name="lastName"
									value={values.lastName}
									onChange={handleChange}
									onBlur={handleBlur}
									error={touched.lastName && Boolean(errors.lastName)}
									helperText={touched.lastName && errors.lastName}
									fullWidth
									required
								/>
							</Stack>
							<TextField
								variant="outlined"
								label="Username"
								name="username"
								value={values.username}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.username && Boolean(errors.username)}
								helperText={touched.username && errors.username}
								fullWidth
								required
							/>
							<TextField
								variant="outlined"
								label="E-Mail"
								name="email"
								value={values.email}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.email && Boolean(errors.email)}
								helperText={touched.email && errors.email}
								fullWidth
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
								fullWidth
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
							<Field
								name="dob"
								component={DatePickerInput}
								label="Date of Birth"
								required
							/>
							<Field
								name="skills"
								component={TechnologiesAutocomplete}
								label="Skills (upto 10)"
								required
								id="select-skills-autocomplete"
							/>
							<Divider sx={{ width: '100%' }}>
								<Typography variant="h5" component="span">
									SOCIALS
								</Typography>
							</Divider>
							<TextField
								variant="outlined"
								label="GitHub"
								name="github"
								value={values.github}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.github && Boolean(errors.github)}
								helperText={touched.github && errors.github}
								fullWidth
							/>
							<TextField
								variant="outlined"
								label="LinkedIn"
								name="linkedin"
								value={values.linkedin}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.linkedin && Boolean(errors.linkedin)}
								helperText={touched.linkedin && errors.linkedin}
								fullWidth
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
										!values.firstName ||
										!values.lastName ||
										!values.email ||
										!values.dob ||
										!values.skills.length ||
										Object.keys(errors).length > 0
									)
								}
							>
								{isSubmitting ? <CircularProgress size={24} /> : 'Sign Up'}
							</Button>
						</Box>
					</Form>
				)}
			</Formik>
			<Typography>
				Already a user?{' '}
				<Button
					type="button"
					onClick={() => {
						navigate('/login');
					}}
				>
					Log In
				</Button>
			</Typography>
		</Box>
	);
}

export default SignupForm;
