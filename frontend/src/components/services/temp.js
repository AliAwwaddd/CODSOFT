import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./services.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import useCreateTask from "../Hooks/useCreateTask";

const Services = ({
	icon,
	title,
	buttonText,
	name,
	projectId,
	deadline,
	tasks,
	barValue,
	isCreator,
}) => {
	const [error, setError] = useState("");
	const [values, setValues] = useState({
		description: "",
		deadline: "",
		assignTo: "",
	});

	const handleInput = (event) => {
		const { name, value } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	};

	const { data, loading, fetchData } = useCreateTask();

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const { description, deadline, assignTo } = values;
			const usernames = assignTo.split(",").map((user) => user.trim());

			const selectedDeadline = new Date(deadline);

			const currentDate = new Date();

			if (selectedDeadline < currentDate) {
				setError("Deadline must be a future date");
				return;
			}

			await fetchData({ projectId, description, deadline, usernames });

			if (Object.values(data).includes(false)) {
				setError("At least one user was not found");
			} else {
				setError("");
				setValues({ description: "", deadline: "", assignTo: "" });
				setToggleState(null);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const [toggleState, setToggleState] = useState(0);

	const toggleTab = (tabIndex) => {
		setToggleState(toggleState === tabIndex ? null : tabIndex);
		setError("");
	};

	return (
		<div className="services__container container grid">
			<div className="services__content">
				<div className="radiaBar">
					<CircularProgressbar value={barValue} text={`${barValue}%`} />
				</div>
				<div>
					<i className={`uil ${icon} services__icon`}></i>
					<Link
						to={`/Project/${projectId}`}
						className="services__title"
						style={{ color: "black", textDecoration: "none" }}
					>
						<span>{title}</span>
					</Link>
				</div>
				<div>
					<span className="services__button" onClick={() => toggleTab(1)}>
						{buttonText}
						<i className="uil uil-arrow-right services__button-icon"></i>
					</span>
				</div>

				{isCreator && (
					<div>
						<span className="services__button" onClick={() => toggleTab(2)}>
							Add Task
							<i className="uil uil-arrow-right services__button-icon"></i>
						</span>
					</div>
				)}

				<div
					className={
						toggleState === 1
							? "services__modal active-modal"
							: "services__modal"
					}
				>
					<div className="services__modal-content">
						<i
							onClick={toggleTab}
							className="uil uil-times services__modal-close"
						></i>
						<h3 className="services__modal-title">{name}</h3>
						<p
							style={{ color: "var(--red)", fontWeight: "bold" }}
							className="services__modal-description"
						>
							DeadLine: {deadline}
						</p>
						<ul className="services__modal-services grid">
							{tasks.map((service, index) => (
								<li key={index} className="services__modal-services">
									<span>
										Task{index + 1}
										<i className="uil uil-check-circle services__modal-icon"></i>
									</span>
									<p className="services__modal-info">{service.description}</p>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div
					className={
						toggleState === 2
							? "services__modal active-modal"
							: "services__modal"
					}
				>
					<div className="services__modal-content2">
						<i
							onClick={toggleTab}
							className="uil uil-times services__modal-close"
						></i>
						<h3 className="services__modal-title">Add a task</h3>
						<p
							style={{ color: "var(--red)", fontWeight: "bold" }}
							className="services__modal-description"
						></p>
						<div className="wrapper__taskCreate">
							<form onSubmit={handleSubmit}>
								<h1></h1>
								<div className="task__C__D">
									<textarea
										name="description"
										cols="10"
										rows="10"
										className="task__C__D-input"
										placeholder="description"
										onChange={handleInput}
										value={values.description}
									></textarea>
								</div>
								<Input
									type="date"
									name="deadline"
									placeholder="Project Deadline"
									value={values.deadline}
									onChange={handleInput}
								/>
								<Input
									type="text"
									name="assignTo"
									placeholder="Assign to e.g: username1, username2, ..."
									value={values.assignTo}
									onChange={handleInput}
								/>

								{error && <span className="error-message">{error}</span>}
								<button className="submit-button-t" type="submit">
									Add
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Services.propTypes = {
	icon: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	buttonText: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	deadline: PropTypes.string.isRequired,
	tasks: PropTypes.array.isRequired,
	barValue: PropTypes.number.isRequired,
	isCreator: PropTypes.bool.isRequired,
};

export default Services;

const Input = ({ type, name, placeholder, value, onChange }) => (
	<div className="input-box__taskCreate">
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

