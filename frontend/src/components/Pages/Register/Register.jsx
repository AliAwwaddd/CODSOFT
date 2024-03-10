import React, { useState } from "react";
import "../Login/login.css";
import { Navigate, Link } from "react-router-dom";
import useRegister from "../../Hooks/useRegister";
import { Input } from "../../Input";

const Register = () => {
	const [error, setError] = useState("");
	const { error: registerError, redirect, registerUser } = useRegister();
	const [values, setValues] = useState({
		name: "",
		username: "",
		password: "",
		password2: "",
	});

	const handleInput = (event) => {
		const { name, value } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (values.password !== values.password2) {
			setError("Passwords do not match");
			return;
		}
		await registerUser(values);
	};

	if (redirect) {
		return <Navigate to="/" />;
	}

	return (
		<div className="wrapper">
			<form onSubmit={handleSubmit}>
				<h1>Register</h1>
				<Input
					type="text"
					name="name"
					placeholder="Name"
					value={values.name}
					onChange={handleInput}
				/>
				<Input
					type="text"
					name="username"
					placeholder="Username"
					value={values.username}
					onChange={handleInput}
				/>
				<Input
					type="password"
					name="password"
					placeholder="Password"
					value={values.password}
					onChange={handleInput}
				/>
				<Input
					type="password"
					name="password2"
					placeholder="Confirm Password"
					value={values.password2}
					onChange={handleInput}
				/>
				{error ||
					(registerError && (
						<span className="error-message">{error && registerError}</span>
					))}
				<button className="register-button" type="submit">
					Register
				</button>
				<div className="register-link">
					<p>
						Already have an account?{" "}
						<Link to="/" className="a">
							Login
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
};

export default Register;
