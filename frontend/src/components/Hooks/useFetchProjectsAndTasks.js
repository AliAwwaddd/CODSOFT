import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const useFetchProjectsAndTasks = (selectedFilter) => {
	const [projectsWithTasks, setProjectsWithTasks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { userData } = useAuth();

	useEffect(() => {
		const fetchProjectsAndTasks = async () => {
			setLoading(true);
			try {
				const url = `http://localhost:3001/MainDash/${userData.userId}${
					selectedFilter ? `?filter=${selectedFilter}` : ""
				}`;
				const projectsResponse = await axios.get(url);
				const projectsData = projectsResponse.data.projects;
				// console.log(projectsData);

				const projectsWithTasks = await Promise.all(
					projectsData.map(async (project) => {
						const tasksResponse = await axios.get(
							`http://localhost:3001/tasks/${project.id}`
						);
						const tasks = tasksResponse.data.tasks;
						// console.log(tasks);
						return { ...project, tasks };
					})
				);

				setProjectsWithTasks(projectsWithTasks);
				console.log(projectsWithTasks);
			} catch (error) {
				console.error("Error fetching projects and tasks:", error);
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchProjectsAndTasks();
	}, [selectedFilter]); // Include selectedFilter in the dependency array

	return { projectsWithTasks, loading, error };
};

export default useFetchProjectsAndTasks;
