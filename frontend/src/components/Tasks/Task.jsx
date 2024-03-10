import React, { useState } from "react";
import "./task.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import useGetChangedTask from "../Hooks/useGetChangedTask";
import useDeleteTask from "../Hooks/useDeleteTask";
import useUpdateTaskProgress from "../Hooks/useUpdateTaskProgress";
import useUpdateDeadline from "../Hooks/useUpdateDeadline";

const Task = ({
	description,
	id,
	id2,
	deadline,
	barValue,
	onClickAction,
	isSelected,
	isCreator,
	updateTask,
	deleteTaskFc,
	updateDeadlineFc,
}) => {
	const [activeTab, setActiveTab] = useState(null);
	const [progress, updateProgress] = useState(barValue);

	const handleInput = (event) => {
		const { name, value } = event.target;
		updateProgress(value);
	};

	const toggleTab = (tabIndex) => {
		setActiveTab(tabIndex === activeTab ? null : tabIndex);
		updateProgress(barValue);
	};

	const {
		data: progressUpdateData,
		loading: progressloading,
		fetchData: updateTaskProgresss,
	} = useUpdateTaskProgress();

	const {
		data: deadlineUpdateData,
		loading: deadlineoading,
		fetchData: updateTaskdeadline,
	} = useUpdateDeadline();

	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const newProgress = formData.get("progress");

		try {
			console.log("New Progress:", newProgress);
			await updateTaskProgresss({ id2, newProgress });
			setActiveTab(null);
		} catch (error) {
			console.error("Error updating progress:", error);
		}
	};

	const { data, loading, error, fetchData } = useGetChangedTask();
	const {
		data: deleteData,
		loading: deleteLoading,
		error: deleteError,
		deleteTask,
	} = useDeleteTask();

	const handleDeleteTask = async (event) => {
		event.preventDefault();
		try {
			console.log(id2);
			await deleteTask(id2);
			setActiveTab(null);
			deleteTaskFc(id2);
		} catch (error) {
			console.error("error deleting task:", error);
		}
	};

	const handleSubmitDescription = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const newDescription = formData.get("newDescription");

		try {
			await fetchData(id2, newDescription);
			updateTask(id2, newDescription);
		} catch (error) {
			console.error("Error updating description:", error);
		}
		setActiveTab(null);
	};

	const handleSubmitDeadline = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const newDeadline = formData.get("newDeadline");
		console.log("New deadline:", newDeadline);
		try {
			await updateTaskdeadline(id2, newDeadline);
			updateDeadlineFc(id2, newDeadline);
		} catch (error) {
			console.error("Error updating progress:", error);
		}
		setActiveTab(null);
	};

	return (
		<div
			className={`task__container container grid ${
				isSelected ? "selected" : ""
			}`}
			onClick={() => (onClickAction ? onClickAction(id) : "")}
		>
			<div className="task__content">
				<div
					className={
						isCreator ? "radiaBar__task radiaBar__task-plus" : "radiaBar__task"
					}
					onClick={() => {
						isCreator && toggleTab(3);
					}}
				>
					<CircularProgressbar value={barValue} text={`${barValue}%`} />
				</div>
				<div>
					<div>{description}</div>
					<span>
						DeadLine: <span style={{ color: "var(--red)" }}>{deadline}</span>
					</span>
				</div>
				{isCreator && (
					<span
						style={{ paddingLeft: "50px", paddingTop: "10px" }}
						className="task__button"
						onClick={() => toggleTab("More")}
					>
						More
						<i className="uil uil-arrow-right task__button-icon"></i>
					</span>
				)}

				{activeTab === "More" && (
					<div className="task__modal active-modal">
						<div className="task__modal-content">
							<i
								onClick={() => setActiveTab(null)}
								className="uil uil-times task__modal-close"
							></i>
							<div className="task-options">
								<button
									onClick={() => toggleTab("Edit Description")}
									style={{ marginRight: "5px" }}
									className="button44 button--flex"
								>
									Edit Description
								</button>

								<button
									onClick={() => toggleTab("Edit Deadline")}
									style={{ marginRight: "5px" }}
									className="button44 button--flex"
								>
									Edit Deadline
								</button>
								<button
									onClick={handleDeleteTask}
									className="button444 button--flex"
								>
									Delete Task
								</button>
							</div>
						</div>
					</div>
				)}
				{activeTab === "Edit Description" && (
					<div className="task__modal active-modal">
						<div className="task__modal-content">
							<i
								onClick={() => setActiveTab(null)}
								className="uil uil-times task__modal-close"
							></i>
							<div className="task__title">Change Description:</div>

							<form onSubmit={handleSubmitDescription}>
								<textarea
									name="newDescription"
									className="contact__form-input44"
									defaultValue={description}
								></textarea>
								<button className="button1 button--flex" type="submit">
									submit
									<i
										key="593358"
										style={{
											marginTop: "5px",
											marginLeft: "5px",
											width: "24px",
											height: "24px",
											viewBox: "0 0 24 24",
											transform: "rotate(-40deg)",
										}}
										className="uil uil-message"
									></i>
								</button>
							</form>
						</div>
					</div>
				)}

				{activeTab === "Edit Deadline" && (
					<div className="task__modal active-modal">
						<div className="task__modal-content">
							<i
								onClick={() => setActiveTab(null)}
								className="uil uil-times task__modal-close"
							></i>
							<div className="task__title" style={{ marginBottom: "30px" }}>
								Change Deadline:
							</div>

							<form onSubmit={handleSubmitDeadline} className="taskForm">
								<input
									type="date"
									name="newDeadline"
									defaultValue={deadline}
								></input>
								<span style={{ paddingLeft: "5px" }}>
									<button
										type="submit"
										className="button1 button--flex"
										disabled={false}
									>
										apply change
										<i
											key="593358"
											style={{
												marginTop: "5px",
												marginLeft: "5px",
												width: "24px",
												height: "24px",
												viewBox: "0 0 24 24",
												transform: "rotate(-40deg)",
											}}
											className="uil uil-message"
										></i>
									</button>
								</span>
							</form>
						</div>
					</div>
				)}
				<div
					className={
						activeTab === 3 ? "services__modal active-modal" : "services__modal"
					}
				>
					<div className="services__modal-content2">
						<i
							onClick={() => toggleTab(3)}
							className="uil uil-times services__modal-close"
						></i>
						<h3 className="services__modal-title">Update Project Progress</h3>
						<div className="wrapper__taskCreate">
							<form onSubmit={handleSubmit}>
								<div className="input-box__taskCreate">
									<label htmlFor="progress">Progress:</label>
									<input
										type="range"
										id="progress"
										name="progress"
										min="0"
										max="100"
										value={progress}
										onChange={handleInput}
									/>
									<output htmlFor="progress">{progress}%</output>
								</div>
								{error && <span className="error-message">{error}</span>}
								<button className="submit-button-t" type="submit">
									Update
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className="task__id">{id}</div>
		</div>
	);
};

export default Task;
