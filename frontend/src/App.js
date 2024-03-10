import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Login from "./components/Pages/Login/Login";
import Register from "./components/Pages/Register/Register";
import CreateProject from "./components/CreateProject";
import MainDash from "./components/MainDash/MainDash";
import Sidebar from "./components/Sidebar/Sidebar";
import Project from "./components/Pages/ProjectPage/Project";
import "./App.css";

const App = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsVisible(true);
		}, 1000); // Delay for 1 second

		return () => clearTimeout(timeout);
	}, []);
	

	return (
		<div id="app" className="App login-background">
			<div id="glass-off" className={isVisible ? "visible" : ""}>
				{isVisible && (
					<AuthProvider>
						<BrowserRouter>
							<ConditionalSidebar />
							<Routes>
								<Route path="/" element={<Login />} />
								<Route path="/Register" element={<Register />} />
								<Route path="/MainDash" element={<ConditionalMainDash />} />
								<Route
									path="/createproject"
									element={<ConditionalCreateProject />}
								/>
								<Route
									path="/Project/:projectId"
									element={<ConditionalProject />}
								/>
							</Routes>
						</BrowserRouter>
					</AuthProvider>
				)}
			</div>
		</div>
	);
};

const ConditionalSidebar = () => {
	const { isLoggedIn } = useAuth();

	return isLoggedIn ? <Sidebar /> : null;
};

const ConditionalMainDash = () => {
	const { isLoggedIn } = useAuth();

	return isLoggedIn ? <MainDash /> : <Navigate to="/" replace />;
};
const ConditionalCreateProject = () => {
	const { isLoggedIn } = useAuth();

	return isLoggedIn ? <CreateProject /> : <Navigate to="/" replace />;
};

const ConditionalProject = () => {
	const { isLoggedIn } = useAuth();

	return isLoggedIn ? <Project /> : <Navigate to="/" replace />;
};
export default App;
