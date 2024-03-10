import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Task from "../../Tasks/Task";
import useFetch from "../../Hooks/useFetch";
import { formatDate } from "../../../Data/Data";
import useIsCreator from "../../Hooks/useIsCreator";
import "./project.css";
import Contact from "../../contact/Contact";
import Comments from "../../Comments/Comments";
import { useAuth } from "../../../Context/AuthContext";

const Project = () => {
	const [selectedTaskId, setSelectedTaskId] = useState(null);
	const [tasks, setTasks] = useState([]);
	const [comments, setComments] = useState([]);
	const { userData } = useAuth();
	const { projectId } = useParams();

	const {
		data: isCreator,
		isLoading: isCreatorLoading,
		error: isCreatorError,
	} = useIsCreator(projectId);

	const deleteTask = (taskId) => {
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
	};

	const updateTask = (taskId, newDescription) => {
		const taskIndex = tasks.findIndex((task) => task.id == taskId);

		if (taskIndex !== -1) {
			const updatedTasks = [...tasks];
			updatedTasks[taskIndex] = {
				...updatedTasks[taskIndex],
				description: newDescription,
			};
			setTasks(updatedTasks);
			console.log(updatedTasks);
			console.log(tasks);
		}
	};

	const reloadComments = async (commentId) => {
		try {
			const response = await fetch(
				`http://localhost:3001/project/getComment/${projectId}/${commentId}`
			);
			const commentData = await response.json();
			// Add the fetched comment to the comments state
			console.log(commentData.comment[0]);
			console.log(projectId + " - " + commentId);
			setComments((prevComments) => [...prevComments, commentData.comment[0]]);
		} catch (error) {
			console.error("Error reloading comments:", error);
		}
	};

	// console.log("project is rendering");

	// fetching all tasks for the project
	const {
		data: tasksData,
		loading: tasksLoading,
		error: tasksError,
	} = useFetch(`http://localhost:3001/project/tasks/${projectId}`);

	const {
		data: commentsData,
		loading: commentsLoading,
		error: commentsError,
	} = useFetch(
		`http://localhost:3001/project/tasks/comments/${projectId}${
			selectedTaskId ? `?taskId=${selectedTaskId}` : ""
		}`
	);

	// console.log(tasksLoading + " - " + commentsLoading);

	// Fetch comments for the selected task
	useEffect(() => {
		if (commentsData) {
			setComments(commentsData.comments);
			// console.log("projectId: " + projectId + " taskId: " + selectedTaskId);
			// console.log(commentsData);
			// console.log(isCreator + "test");
		}
		if (commentsError) {
			console.error("Error fetching tasks:", commentsError);
		}
	}, [commentsData, commentsError]);

	useEffect(() => {
		if (tasksData) {
			setTasks(tasksData.tasks);
		}
		if (tasksError) {
			console.error("Error fetching tasks:", tasksError);
		}
	}, [tasksData]);

	// Handle task click
	const handleTaskClick = (taskId) => {
		setSelectedTaskId(taskId);
		// console.log("selectedTaskId: " + taskId);
	};

	if (tasksLoading || isCreatorLoading || commentsLoading)
		return <h3>Loading...</h3>;
	if (tasksError || commentsError)
		return (
			<h3>an error occurred: {tasksError ? tasksError : commentsError}</h3>
		);
	if (tasks.length === 0) return <h3>No tasks for this project</h3>;

	// console.log(isCreator);
	return (
		<div className="project__container">
			<div className="tasks__container">
				{tasks.map((task) => (
					<Task
						description={task.description}
						id={selectedTaskId ? "" : task.id}
						id2={task.id}
						deadline={formatDate(task.deadline)}
						barValue={task.progress}
						onClickAction={
							selectedTaskId === task.id ? null : () => handleTaskClick(task.id)
						}
						isSelected={selectedTaskId === task.id}
						isCreator={isCreator.isCreator}
						updateTask={updateTask}
						deleteTaskFc={deleteTask}
						key={task.id}
					/>
				))}
			</div>

			<div className="task__comments__container">
				<h4 style={{ marginBottom: "10px" }} className="task__comments__title">
					Task comments
				</h4>
				<div
					className={
						selectedTaskId == null
							? "comments__container"
							: "comments__container default__comment"
					}
				>
					{comments.map((comment) => (
						<Comments
							content={comment.comment}
							timestamp={comment.timestamp}
							commentUserId={comment.user_id}
							taskId={selectedTaskId ? "" : comment.task_id}
							isCreator={isCreator}
							userId={userData.userId}
							key={comment.id}
						/>
					))}
				</div>
				<div className="contact__container">
					{selectedTaskId && (
						<Contact
							userId={userData.userId}
							taskId={selectedTaskId}
							projectId={projectId}
							reloadComments={reloadComments}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Project;
