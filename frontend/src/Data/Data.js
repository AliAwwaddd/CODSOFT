
import {
	UilEstate,
	UilBookMedical,
	UilSetting,
} from "@iconscout/react-unicons";

export const SidebarData = [
	{
		icon: UilEstate,
		heading: "Dashboard",
		path: "http://localhost:3000/MainDash",
	},

	{
		icon: UilBookMedical,
		heading: "Add Project",
		path: "http://localhost:3000/CreateProject",
	},

	// {
	// 	icon: UilSetting,
	// 	heading: "settings",
	// },
];

export const formatDate = (dateString) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

