import express from "express";
import cors from "cors";
import {
	getProjects,
	getProject,
	createProject,
	checkUser,
	insertUser,
	getProjectsForUser,
	getProjectsWithUser,
	fetchTasksFromDatabase,
	getCompletedProjects,
	DeleteTaskFromDatabase,
	checkIfUserIsCreator,
	getCommentsForTask,
	getAllCommentsForProject,
	getUsername,
	InsertComment,
	getComment,
	editTaskDescription,
	deleteTask,
	findUser,
	insertNewTask,
	updateProjectProgress,
	updateTaskProgress,
	updateTaskDeadline,
	DeleteComment,
} from "./database.js";

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3001, () => {
	console.log("Server is running on port 3001 YUPPIIIII");
});

app.get("/projects", async (req, res) => {
	const projects = await getProjects();
	res.send(projects);
	// res.send("this should be the projects");
});

app.get("/projects/:id", async (req, res) => {
	const id = req.params.id;
	const project = await getProject(id);
	res.send(project);
	// res.send("this should be the projects");
});

app.post("/Createproject", async (req, res) => {
	try {
		const { name, deadline, creator_id } = req.body;

		if (!name || !creator_id || !deadline) {
			return res
				.status(400)
				.json({ message: "Name, progress, and deadline are required" });
		}

		const project = await createProject(name, deadline, creator_id);

		res.status(201).json(project);
	} catch (error) {
		console.error("Error creating project:", error);

		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("sike! Something broke!");
});

app.post("/login", async (req, res) => {
	try {
		const result = await checkUser(req.body.username, req.body.password);
		if (!result.success) {
			return res
				.status(401)
				.json({ message: "Login failed. Invalid email or password." });
		} else {
			return res.status(200).json({
				message: "Login successful.",
				userId: result.userId,
				name: result.name,
				success: true,
			});
		}
	} catch (error) {
		console.error("Error during login:", error);
		res
			.status(500)
			.json({ message: "Internal server error. Please try again later." });
	}
});

app.post("/Register", async (req, res) => {
	// Extract user data from the request body
	// const { name, username, password } = req.body;
	// res.json({ message: req.body });

	try {
		// Insert the user into the database
		const userInserted = await insertUser(
			req.body.name,
			req.body.username,
			req.body.password
		);
		if (userInserted) {
			res.status(201).json({ message: "User registered successfully" });
		} else {
			res.status(400).json({
				message: "Username already exists.",
			});
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error registering user", error: error.message });
	}
});

app.get("/MainDash/:id", async (req, res) => {
	try {
		const userId = req.params.id; // Get the user ID from URL parameters
		const filter = req.query.filter; // Get the filter option from query parameters

		let projects;
		if (!filter || filter === "all") {
			projects = await getProjectsForUser(userId);
		} else if (filter === "collaborations") {
			projects = await getProjectsWithUser(userId);
		} else {
			// Handle other filter options if needed
			// You can modify this logic based on your filter options
			projects = await getCompletedProjects(userId);
		}

		res.status(200).json({ projects }); // Send projects as JSON response
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching projects", error: error.message });
	}
});

// app.delete("/tasks/:projectId/:taskId", async (req, res) => {
// 	try {
// 		const taskId = req.params.taskId;
// 		const projectId = req.params.projectId;
// 		// Call a function to delete the task from the database
// 		const response = await DeleteTaskFromDatabase(taskId, projectId);
// 		res.status(200).json({ response: response.affectedRows });
// 	} catch (error) {
// 		console.error("Error deleting task:", error);
// 		res.status(500).json({ message: "Error deleting task" });
// 	}
// });
app.get("/tasks/:projectId", async (req, res) => {
	try {
		const projectId = req.params.projectId;
		// Fetch tasks from the database based on projectId
		const tasks = await fetchTasksFromDatabase(projectId);
		res.status(200).json({ tasks });
	} catch (error) {
		console.error("Error fetching tasks:", error);
		res.status(500).json({ message: "Error fetching tasks" });
	}
});

app.get("/project/tasks/:projectId", async (req, res) => {
	try {
		const projectId = req.params.projectId;
		// Fetch tasks from the database based on projectId
		const tasks = await fetchTasksFromDatabase(projectId);
		res.status(200).json({ tasks });
	} catch (error) {
		console.error("Error fetching tasks:", error);
		res.status(500).json({ message: "Error fetching tasks" });
	}
});

app.get("/project/:userId/:projectId", async (req, res) => {
	try {
		const projectId = req.params.projectId;
		const userId = req.params.userId;
		// Fetch tasks from the database based on projectId
		const isCreator = await checkIfUserIsCreator(userId, projectId);
		res.status(200).json({ isCreator });
	} catch (error) {
		console.error("Error checking if user is creator:", error);
		res.status(500).json({ message: "Error checking if user is creator" });
	}
});

app.get("/project/tasks/comments/:projectId", async (req, res) => {
	try {
		let comments;
		const taskId = req.query.taskId;
		const projectId = req.params.projectId;

		// Check if taskId is provided
		if (taskId) {
			// Fetch comments for the selected task
			comments = await getCommentsForTask(taskId);
		} else {
			// Fetch all comments for the project
			// Implement your logic to fetch all comments here
			comments = await getAllCommentsForProject(projectId);
		}

		res.status(200).json({ comments });
	} catch (error) {
		console.error("Error fetching comments:", error);
		res.status(500).json({ message: "Error fetching comments" });
	}
});

app.get("/getname/:userId", async (req, res) => {
	try {
		const userId = req.params.userId;
		// Call the getUsername function to get the username based on the user ID
		const name = await getUsername(userId);
		// If username is not null, return it as a JSON response
		if (name !== null) {
			res.json({ name });
		} else {
			res.status(404).json({ error: "User not found" });
		}
	} catch (error) {
		console.error("Error fetching username:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.post("/project/tasks/insertComment", async (req, res) => {
	try {
		const { userId, taskId, comment, projectId } = req.body;

		// Call the InsertComment function to insert the comment into the database
		const insertId = await InsertComment(userId, taskId, comment, projectId);

		// Respond with the ID of the inserted comment
		res.json(insertId);
	} catch (error) {
		console.error("Error inserting comment:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/project/getComment/:projectId/:commentId", async (req, res) => {
	try {
		let comment;
		const projectId = req.params.projectId;
		const commentId = req.params.commentId;
		comment = await getComment(projectId, commentId);
		res.status(200).json({ comment });
	} catch (error) {
		console.error("Error fetching comments:", error);
		res.status(500).json({ message: "Error fetching comment" });
	}
});

app.post("/project/editTaskDescription", async (req, res) => {
	try {
		const { taskId, newDescription } = req.body; // Extract taskId and newDescription from the request body
		const affectedRows = await editTaskDescription(taskId, newDescription);
		res.status(200).json({ affectedRows });
	} catch (error) {
		console.error("Error updating task description:", error);
		res.status(500).json({ message: "Error updating task description" });
	}
});

app.post("/project/updateTaskDeadline", async (req, res) => {
	const { taskId, newDeadline } = req.body;

	try {
		const affectedRows = await updateTaskDeadline(taskId, newDeadline);
		if (affectedRows != 1) {
			return res.status(400).json("unable to update progress");
		}

		return res.status(200).json("Task progress updated successfully.");
	} catch (error) {
		console.error("Error adding task:", error);
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

app.delete("/project/deleteTask/:taskId", async (req, res) => {
	try {
		const taskId = req.params.taskId;

		// Call the deleteTask function passing the taskId
		const deleted = await deleteTask(taskId);

		if (deleted) {
			res.status(200).json({ message: "Task deleted successfully" });
		} else {
			res
				.status(404)
				.json({ message: "Task not found or could not be deleted" });
		}
	} catch (error) {
		console.error("Error deleting task:", error);
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

app.post("/project/addTaskWithUsers", async (req, res) => {
	try {
		const { projectId, description, deadline, usernames } = req.body;

		// Check if users exist before inserting the task
		const userCheckResults = await findUser(usernames);
		if (userCheckResults.some((result) => result === false)) {
			// If at least one user does not exist, return an error response
			return res
				.status(400)
				.json({ message: "One or more users do not exist" });
		}

		// If all users exist, proceed with inserting the task
		const taskInsertionResults = await insertNewTask(
			projectId,
			description,
			deadline,
			usernames
		);

		// Return success response with the results of task insertion
		res.status(200).json({ results: taskInsertionResults });
	} catch (error) {
		console.error("Error adding task:", error);
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

app.post("/project/UpdateProgress", async (req, res) => {
	const { projectId, newProgress } = req.body;

	try {
		const affectedRows = await updateProjectProgress(projectId, newProgress);
		if (affectedRows != 1) {
			return res.status(400).json("unable to update projress");
		}

		return res.status(200).json("Project progress updated successfully.");
	} catch (error) {
		console.error("Error adding task:", error);
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

app.post("/project/UpdateTaskProgress", async (req, res) => {
	const { id2, newProgress } = req.body;

	try {
		const affectedRows = await updateTaskProgress(id2, newProgress);
		if (affectedRows != 1) {
			return res.status(400).json("unable to update projress");
		}

		return res.status(200).json("Task progress updated successfully.");
	} catch (error) {
		console.error("Error adding task:", error);
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

app.delete("/project/task/comment/:commentId/:taskId", async (req, res) => {
	try {
		const commentId = req.params.commentId;
		const taskId = req.params.taskId;

		const deleted = await DeleteComment(commentId, taskId);

		if (deleted) {
			res.status(200).json({ message: "Comment deleted successfully" });
		} else {
			res
				.status(404)
				.json({ message: "Task not found or could not be deleted" });
		}
	} catch (error) {
		console.error("Error deleting task:", error);
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

// app.get("/tempTesting/:userId", async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const result = await findUser([userId]); // Pass userId as an array to findUser function
//         return res.status(200).json({ result: result });
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// });
