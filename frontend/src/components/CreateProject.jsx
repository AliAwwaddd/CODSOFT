import React, { useState } from "react";
import "./createProject.css";

import useCreateProject from "./Hooks/useCreateProject";
import { useAuth } from "../Context/AuthContext";

const CreateProject = () => {
	const [error, setError] = useState("");

	const [values, setValues] = useState({
		name: "",
		deadline: "",
	});

	const { data, loading, fetchData } = useCreateProject();
	const { userData } = useAuth();

	const handleInput = (event) => {
		const { name, value } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const { name, deadline } = values;

			const creator_id = userData.userId;

			const selectedDeadline = new Date(deadline);

			const currentDate = new Date();

			if (selectedDeadline < currentDate) {
				setError("Deadline must be a future date");
				return;
			}

			await fetchData({ name, deadline, creator_id });
			setValues({ name: "", deadline: "" });
		} catch (error) {
			console.error("Error:", error);
		}
	};
	return (
		<div className="wrapperrr">
			<form onSubmit={handleSubmit}>
				<h1>Create a Project</h1>
				<Input
					type="text"
					name="name"
					placeholder="Project name"
					value={values.name}
					onChange={handleInput}
				/>
				<Input
					type="date"
					name="deadline"
					placeholder="Project Deadline"
					value={values.deadline}
					onChange={handleInput}
				/>
				{error && <span className="error-message">{error}</span>}
				<button className="submit-button" type="submit">
					Create
				</button>
			</form>
		</div>
	);
};

export default CreateProject;

const Input = ({ type, name, placeholder, value, onChange }) => (
	<div className="input-box">
		<input
			type={type}
			name={name}
			placeholder={placeholder}
			required
			value={value}
			onChange={onChange}
		/>
	</div>
);
