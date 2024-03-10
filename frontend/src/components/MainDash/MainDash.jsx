// MainDash.js
import React, { useState } from "react";
import "./maindash.css";
import Services from "../services/Services";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useFetchProjectsAndTasks from "../Hooks/useFetchProjectsAndTasks"; // Import your custom hook
import { formatDate } from "../../Data/Data";
import FilterSidebar from "./FilterSidebar";

const MainDash = () => {
	const [selectedFilter, setSelectedFilter] = useState(null);
	const [selected, setSelected] = useState(0);
	const [reload, setReload] = useState(false);

	const { projectsWithTasks, loading, error } =
		useFetchProjectsAndTasks(selectedFilter);

	const updateProgressFc = (newProgress, projectId) => {
		const projectIndex = projectsWithTasks.findIndex(
			(project) => project.id === projectId
		);
		if (projectIndex !== -1) {
			const updatedProjectsWithTasks = [...projectsWithTasks];
			updatedProjectsWithTasks[projectIndex].progress = newProgress;
			setReload(!reload);
		}
	};

	if (loading) return <h3>Loading...</h3>;
	if (error) return <div className="error">{error.message}</div>;

	console.log("main dash rendering");

	return (
		<div className="MainDash">
			<FilterSidebar
				selectedFilter={selectedFilter}
				setSelectedFilter={setSelectedFilter}
				setSelected={setSelected}
			/>

			<div className="services__containerr">
				{projectsWithTasks.map((project) => (
					<Services
						icon="uil-web-grid"
						title={project.name}
						buttonText="Overview"
						name={project.name}
						projectId={project.id}
						deadline={formatDate(project.deadline)}
						tasks={project.tasks.map((task) => ({
							description: task.description,
						}))}
						barValue={project.progress}
						id={project.id}
						isCreator={
							selectedFilter == null || selectedFilter == "all" ? true : false
						}
						updateProgressFc={updateProgressFc}
						key={project.id}
					/>
				))}
			</div>
		</div>
	);
};

export default MainDash;
