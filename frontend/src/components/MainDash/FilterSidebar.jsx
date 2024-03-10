import React from "react";

const FilterSidebar = ({ selectedFilter, setSelectedFilter, setSelected }) => {
	const handleFilterSelect = (filter) => {
		setSelectedFilter(filter);
		setSelected(filter);
	};

	return (
		<div className="filter-sidebar">
			<span>Filter By:</span>
			<button
				key="1"
				className={selectedFilter === "1" ? "task__active" : ""}
				onClick={() => handleFilterSelect("all")}
			>
				Your Projects
			</button>
			<button
				key="2"
				className={selectedFilter === "2" ? "task__active" : ""}
				onClick={() => handleFilterSelect("collaborations")}
			>
				Collaborations
			</button>
			<button
				key="3"
				className={selectedFilter === "3" ? "task__active" : ""}
				onClick={() => handleFilterSelect("completed")}
			>
				Completed
			</button>
		</div>
	);
};

export default FilterSidebar;
