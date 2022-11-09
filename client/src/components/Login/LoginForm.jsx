import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import React from 'react';

// Creating schema
const schema = Yup.object().shape({
	email: Yup.string()
		.required('Email is a required field')
		.email('Invalid email format'),
	password: Yup.string()
		.required('Password is a required field')
		.min(8, 'Password must be at least 8 characters'),
});

function LoginForm() {
	return (
		<>
			{/* Wrapping form inside formik tag and passing our schema to validationSchema prop */}
			<Formik
				validationSchema={schema}
				initialValues={{ email: '', password: '' }}
				onSubmit={(values) => {
					alert(JSON.stringify(values));
				}}
			>
				{({ values, errors, touched, handleChange, handleBlur }) => (
					<Form>
						<span>Login</span>
						<Field
							type="email"
							name="email"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.email}
							placeholder="Enter email id / username"
							className="form-control inp_text"
							id="email"
						/>
						<p className="error">
							{errors.email && touched.email && errors.email}
						</p>
						<Field
							type="password"
							name="password"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.password}
							placeholder="Enter password"
							className="form-control"
						/>
						<p className="error">
							{errors.password && touched.password && errors.password}
						</p>
						<button type="submit">Login</button>
					</Form>
				)}
			</Formik>
		</>
	);
}

export default LoginForm;
