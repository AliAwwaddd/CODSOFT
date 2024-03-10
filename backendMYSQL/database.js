import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
	.createPool({
		user: process.env.mySQLUSER,
		host: process.env.mySQLHOST,
		password: process.env.mySQLPASSWORD,
		database: process.env.mySQLDATABASE,
	})
	.promise();

export async function getProjects() {
	const [rows] = await pool.query("SELECT * FROM Projects");
	return rows;
}

export async function getProjectsForUser(id) {
	const [rows] = await pool.query(
		`
        SELECT * FROM Projects WHERE creator_id = ? 
        `,
		[id]
	);
	return rows;
}

export async function getCompletedProjects(id) {
	const [rows] = await pool.query(
		`
        SELECT *
        FROM Projects
        WHERE progress = 100
        AND (
            creator_id = ?
            OR id IN (
                SELECT project_id
                FROM Tasks
                WHERE id IN (
                    SELECT task_id
                    FROM TaskAssignments
                    WHERE user_id = ?
                )
            )
        )
        `,
		[id, id]
	);
	return rows;
}

export async function getProjectsWithUser(id) {
	const [rows] = await pool.query(
		`
		SELECT *
		FROM Projects
		WHERE creator_id != ? AND id IN (
			SELECT project_id
			FROM Tasks
			WHERE id IN (
				SELECT task_id
				FROM TaskAssignments
				WHERE user_id = ?
			))
        `,
		[id, id]
	);
	return rows;
}

export async function getProject(id) {
	const [rows] = await pool.query(
		`
        SELECT *
        FROM projects
        WHERE id = ?
    `,
		[id]
	);
	return rows;
}

export async function createProject(name, deadline, creator_id) {
	const [result] = await pool.query(
		`
        INSERT INTO Projects (name, deadline, creator_id)
        VALUES(?, ? ,?)
    `,
		[name, deadline, creator_id]
	);
	// const id = result.insertId;
	// return getProject(id);
	return result;
}

export async function checkUser(username, password) {
	try {
		const [result] = await pool.query(
			`
            SELECT * FROM Users WHERE username = ? AND password = ?
            `,
			[username, password]
		);

		if (result.length > 0) {
			const user = result[0];
			return { success: true, userId: user.id, name: user.name };
		} else {
			return { success: false, message: "Invalid username or password" };
		}
	} catch (error) {
		console.error("Error checking user:", error);
		throw error;
	}
}

export async function checkUsernameExists(username) {
	try {
		const [result] = await pool.query(
			`
            SELECT * FROM Users WHERE username = ?
            `,
			[username]
		);

		return result.length > 0; // Returns true if username exists, false otherwise
	} catch (error) {
		console.error("Error checking username:", error);
		throw error;
	}
}

export async function insertUser(name, username, password) {
	try {
		// Check if the username already exists
		const usernameExists = await checkUsernameExists(username);
		if (usernameExists) {
			return false; // Username is already taken
		}

		// Insert the user into the database
		const result = await pool.query(
			`
            INSERT INTO Users (name, username, password) VALUES (?, ?, ?)
            `,
			[name, username, password]
		);

		return true; // Returns true if user inserted successfully, false otherwise
	} catch (error) {
		console.error("Error inserting user:", error);
		throw error;
	}
}

// Function to fetch tasks from the database based on projectId
export async function fetchTasksFromDatabase(projectId) {
	try {
		// Perform your database query to fetch tasks based on the projectId
		// Replace this with your actual database query
		const [rows] = await pool.query(
			"SELECT * FROM Tasks WHERE project_id = ?",
			[projectId]
		);
		return rows;
	} catch (error) {
		throw error;
	}
}

export async function DeleteTaskFromDatabase(taskId, projectId) {
	try {
		// Perform your database query to delete the task based on the taskId
		// Replace this with your actual database query
		const [result] = await pool.query(
			"DELETE FROM Tasks WHERE id = ? AND project_id = ?",
			[taskId, projectId]
		);
		return result;
	} catch (error) {
		throw error;
	}
}

export async function checkIfUserIsCreator(userId, projectId) {
	const [rows] = await pool.query(
		`
        SELECT COUNT(*) AS count FROM Projects WHERE creator_id = ? AND id = ?
        `,
		[userId, projectId]
	);
	return rows[0].count === 1;
}

export async function getCommentsForTask(taskId) {
	try {
		const [rows] = await pool.query(
			`
		SELECT * FROM Comments WHERE task_id = ?
		`,
			[taskId]
		);
		return rows; // Return comments for the task
	} catch (error) {
		console.error("Error fetching comments:", error);
		throw error; // Throw error for handling in the caller function
	}
}

export async function getAllCommentsForProject(projectId) {
	try {
		// Replace this with your actual database query
		const [rows] = await pool.query(
			`
		SELECT * FROM Comments WHERE project_id = ?
		`,
			[projectId]
		);
		return rows; // Return comments for the project
	} catch (error) {
		console.error("Error fetching comments for project:", error);
		throw error; // Throw error for handling in the caller function
	}
}

export async function getUsername(userId) {
	try {
		// Query the database to fetch the username for the given user ID
		const [rows] = await pool.query(
			`
		SELECT name FROM Users WHERE id = ?
		`,
			[userId]
		);
		if (rows.length > 0) {
			return rows[0].name; // Return the username if user exists
		} else {
			return null; // Return null if user does not exist
		}
	} catch (error) {
		console.error("Error fetching username:", error);
		throw error; // Throw error for handling in the caller function
	}
}

export async function InsertComment(userId, taskId, comment, projectId) {
	try {
		const [rows] = await pool.query(
			`
            INSERT INTO Comments(user_id, task_id, comment, project_id) VALUES (?, ?, ?, ?)
            `,
			[userId, taskId, comment, projectId]
		);
		// console.log(row);
		return rows.insertId;
	} catch (error) {
		console.error("Error inserting comment:", error);
		throw error;
	}
}

export async function getComment(projectId, commentId) {
	try {
		const [comment] = await pool.query(
			`
		SELECT * FROM Comments WHERE project_id = ? AND id = ?
		`,
			[projectId, commentId]
		);
		return comment; // Return comments for the task
	} catch (error) {
		console.error("Error fetching comments:", error);
		throw error; // Throw error for handling in the caller function
	}
}

// insertUser("test", "test", "test");
// insertUser("test", "test2", "test3");

// InsertComment("1","7","blabla","600");

export async function editTaskDescription(taskId, newDescription) {
	try {
		// Update the task's description in the database
		const [result] = await pool.query(
			`
            UPDATE Tasks SET description = ? WHERE id = ?
            `,
			[newDescription, taskId]
		);

		return result.affectedRows; // Returns true if the task's description is updated successfully
	} catch (error) {
		console.error("Error editing task description:", error);
		throw error;
	}
}

export async function updateTaskDeadline(taskId, newDeadline) {
	try {
		// Update the task's deadline in the database
		const result = await pool.query(
			`
            UPDATE Tasks SET deadline = ? WHERE id = ?
            `,
			[newDeadline, taskId]
		);

		return true; // Returns true if the task's deadline is updated successfully
	} catch (error) {
		console.error("Error editing task deadline:", error);
		throw error;
	}
}

async function deleteAllCommentsForTask(taskId) {
	try {
		// Delete all comments associated with the task
		await pool.query(
			`
            DELETE FROM Comments WHERE task_id = ?
            `,
			[taskId]
		);
	} catch (error) {
		console.error("Error deleting comments for task:", error);
		throw error;
	}
}

export async function deleteTask(taskId) {
	try {
		// First delete all comments associated with the task
		await deleteAllCommentsForTask(taskId);

		const [result] = await pool.query(
			`
				DELETE FROM TaskAssignments where task_id = ?
			`,
			[taskId]
		);
		const [result2] = await pool.query(
			`
            DELETE FROM Tasks WHERE id = ?
            `,
			[taskId]
		);

		return true; // Returns true if the task is deleted successfully
	} catch (error) {
		console.error("Error deleting task:", error);
		throw error;
	}
}

export async function findUser(usernames) {
	try {
		const results = [];

		for (const username of usernames) {
			const [result] = await pool.query(
				`
                SELECT username FROM Users WHERE username = ?
                `,
				[username]
			);

			results.push(result.length == 1);
		}

		return results;
	} catch (error) {
		console.error("Error finding user:", error);
		throw error;
	}
}

export async function CreateTask(projectId, description, deadline) {
	try {
		const [result] = await pool.query(
			`
            INSERT INTO Tasks(project_id, description, deadline) VALUES(?, ?, ?)
            `,
			[projectId, description, deadline]
		);

		return result.insertId;
	} catch (error) {
		console.error("Error creating task:", error);
		throw error;
	}
}

export async function insertNewTask(
	projectId,
	description,
	deadline,
	usernames
) {
	try {
		let results;
		const taskId = await CreateTask(projectId, description, deadline);
		results = [];

		for (const username of usernames) {
			// Execute the query for the current username
			const [result] = await pool.query(
				`
                INSERT INTO TaskAssignments VALUES( ?, ?)
                `,
				[taskId, username]
			);
			// Push the result to the results array
			results.push(result.affectedRows == 1);
		}

		return results;
	} catch (error) {
		console.error(
			`Error inserting task assignment for certain username:`,
			error
		);
		throw error;
	}
}

export async function updateProjectProgress(projectId, newProgress) {
	try {
		const [result] = await pool.query(
			`
				UPDATE Projects set progress = ? WHERE id = ?
			`,
			[newProgress, projectId]
		);
		return result.affectedRows == 1;
	} catch (error) {
		console.error(`Error updating task progress`, error);
		throw error;
	}
}

export async function updateTaskProgress(taskId, newProgress) {
	try {
		const [result] = await pool.query(
			`
				UPDATE Tasks set progress = ? WHERE id = ?
			`,
			[newProgress, taskId]
		);
		return result.affectedRows == 1;
	} catch (error) {
		console.error(`Error updating task progress`, error);
		throw error;
	}
}

export async function DeleteComment(commentId, taskId) {
	try {
		const [result] = await pool.query(
			"DELETE FROM comments WHERE id = ? AND task_id = ?",
			[commentId, taskId]
		);
		return result.affectedRows == 1;
	} catch (error) {
		throw error;
	}
}