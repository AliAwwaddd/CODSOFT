// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userData, setUserData] = useState({});

	const login = (userId, name) => {
		setIsLoggedIn(true);
		setUserData({ userId, name }); // Store user data
	};

	useEffect(() => {
		// console.log("isLoggedIn:", isLoggedIn);
	}, [isLoggedIn]);

	const logout = () => {
		document.getElementById("app").classList.add("login-background");
		document.getElementById("glass-off").classList.remove("AppGlass");
		setIsLoggedIn(false);
	};

	return (
		<AuthContext.Provider value={{ isLoggedIn, userData, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};


