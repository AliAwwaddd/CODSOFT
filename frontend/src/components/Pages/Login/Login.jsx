import React, { useState } from "react";
import "./login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Navigate, Link } from "react-router-dom";
import useLogin from "../../Hooks/useLogin";

const Login = () => {
	const { error, loading, loginUser } = useLogin();
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [redirect, setRedirect] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		await loginUser(formData.username, formData.password);
		setRedirect(true);
	};

	if (redirect) {
		return <Navigate to="/MainDash" />;
	}
	return (
		<div className="wrapper">
			<form onSubmit={handleSubmit}>
				<h1>Login</h1>
				<div className="input-box">
					<input
						type="text"
						name="username"
						placeholder="Username"
						required
						onChange={handleChange}
						value={formData.username}
					/>
					<FaUser className="icon" />
					{error && <span className="error-message">{error}</span>}
				</div>

				<div className="input-box">
					<input
						name="password"
						type="password"
						placeholder="Password"
						required
						onChange={handleChange}
						value={formData.password}
					/>
					<FaLock className="icon" />
				</div>

				<div className="remember-forgot">
					<label>
						<input type="checkbox" name="rememberMe" />
						Remember me
					</label>
				</div>

				{!loading && (
					<button className="login-button" type="submit">
						login
					</button>
				)}
				{loading && (
					<button className="login-button" disabled>
						loading...
					</button>
				)}

				<div className="register-link">
					<p>
						Dont have an account?
						<Link to="/Register" className="a">
							Register
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
};

export default Login;
