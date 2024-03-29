import React, { useState, useEffect } from "react";
import Logo from "../../imgs/logo.png";
import "./sidebar.css";
import { SidebarData } from "../../Data/Data";
import { UilSignout } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Sidebar = () => {
	useEffect(() => {
		document.getElementById("app").classList.remove("login-background");
		document.getElementById("glass-off").classList.add("AppGlass");
	}, []);

	const { userData, logout } = useAuth();
	const [selected, setSelected] = useState(0);

	const handleSignout = () => {
		const confirmed = window.confirm(
			"Are you sure you want to logout?"
		);
		if (!confirmed) {
			return;
		}
		logout();
	};

	return (
		<div className="Sidebar">
			<div className="logo">
				<img src={Logo} alt="" />
				<span>
					Welcome <span>{userData.name}</span>
				</span>
			</div>

			<div className="menu">
				{SidebarData.map((item, index) => {
					return (
						<Link
							to={item.path}
							className={
								selected === index ? "menu__item activee" : "menu__item"
							}
							key={index}
							onClick={() => setSelected(index)}
							style={{ color: "black", textDecoration: "none" }}
						>
							<item.icon />
							<span>{item.heading}</span>
						</Link>
					);
				})}
				<div className="menu__item" onClick={handleSignout}>
					<UilSignout />
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
