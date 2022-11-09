import { Formik, Form, Field } from 'formik';
import React from 'react';
import * as Yup from 'yup';

const schema = Yup.object().shape({
	firstname: Yup.string()
		.required('Firstname is a required field')
		.min(3, 'Firstname must be atleast 4 cahracters'),
	lastname: Yup.string()
		.required('Lastname is a required field')
		.min(3, 'Lastname must be atleast 3 characters'),
	username: Yup.string()
		.required('Enter a username')
		.min(5, 'username must be atleast 5 characters'),
	dob: Yup.date(),
	bio: Yup.string().min(5, 'Bio must be atleast 5 characters'),
	location: Yup.string(),
	email: Yup.string()
		.required('Email is a required field')
		.email('Invalid email format'),
	password: Yup.string()
		.required('Password is a required field')
		.min(8, 'Password must be at least 8 characters'),
});

function SignupForm() {
	return (
		<Formik
			validationSchema={schema}
			initialValues={{
				firstName: '',
				lastName: '',
				bio: '',
				email: '',
				password: '',
			}}
			onSubmit={async (values) => {
				alert(JSON.stringify(values));
			}}
		>
			{({ values, errors, touched, handleChange, handleBlur }) => (
				<Form>
					<span>Sign Up!!</span>
					<Field
						name="firstname"
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.firstName}
						placeholder="Enter firstname"
						className="form-control inp_text"
						id="firstname"
					/>
					<p className="error">
						{errors.firstName && touched.firstName && errors.firstname}
					</p>
					<Field
						name="lastname"
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.lastname}
						placeholder="Enter lastname"
						className="form-control inp_text"
						id="lastname"
					/>
					<p className="error">
						{errors.lastname && touched.lastname && errors.lastname}
					</p>
					<Field
						name="username"
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.username}
						placeholder="Enter username"
						className="form-control inp_text"
						id="username"
					/>
					<p className="error">
						{errors.username && touched.username && errors.username}
					</p>
					<Field
						name="bio"
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.bio}
						placeholder="Enter bio"
						className="form-control inp_text"
						id="bio"
					/>
					<p className="error">{errors.bio && touched.bio && errors.bio}</p>
					<Field
						name="email"
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.email}
						placeholder="Enter email id:"
						className="form-control inp_text"
						id="email"
					/>
					<p className="error">
						{errors.email && touched.email && errors.email}
					</p>
					<Field
						name="password"
						type="password"
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.password}
						placeholder="Enter password"
						className="form-control inp_text"
						id="password"
					/>
					<p className="error">
						{errors.password && touched.password && errors.password}
					</p>
					<button type="submit">Signup</button>
				</Form>
			)}
		</Formik>
	);
}

export default SignupForm;
