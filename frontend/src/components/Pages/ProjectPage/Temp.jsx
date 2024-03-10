import React from "react";
// import Task from "./Task";

const temp = () => {
	return (
		<div
			className="nn1"
			style={{
                justifyContent: "center",
                alignItems: "center",
                maxHeight: "700px", // Set the maximum height here
                overflowY: "auto"
			}}
		>
			<Task
				description="description"
				id="2222"
				deadline="3-3-2024"
				barValue="50"
				key="1"
			/>
			<Task
				description="description"
				id="2222"
				deadline="3-3-2024"
				barValue="50"
				key="1"
			/>
			<Task
				description="description"
				id="2222"
				deadline="3-3-2024"
				barValue="50"
				key="1"
			/>
			<Task
				description="description"
				id="2222"
				deadline="3-3-2024"
				barValue="50"
				key="1"
			/>
			<Task
				description="description"
				id="2222"
				deadline="3-3-2024"
				barValue="50"
				key="1"
			/>
		</div>
	);
};

export default temp;
