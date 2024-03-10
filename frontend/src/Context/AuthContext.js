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

// * 		createContext(): This function creates a new context object. This context object will be used to pass data (in this case, authentication status and related functions) to components in the component tree.
// * 		useAuth(): This is a custom hook created to simplify the usage of the authentication context. It internally uses the useContext() hook to access the context value.
// * 		AuthProvider: This is a component that serves as the provider for the authentication context. It wraps the entire application (or relevant parts of it) to make the authentication state available to all components within its subtree.
// * 		useState(): This hook is used to manage the authentication status (isLoggedIn). It returns the current state value and a function to update it.
// * 		login() and logout(): These functions are used to update the authentication status. login() sets isLoggedIn to true, indicating that the user is authenticated, while logout() sets it to false, indicating that the user is logged out.
// * 		value object: This object contains the values that will be provided by the context. In this case, it includes the isLoggedIn state and the login() and logout() functions.
// * 		<AuthContext.Provider>: This is where the context provider is used. It takes a value prop, which is set to the value object defined earlier. This makes the isLoggedIn, login(), and logout() available to all components wrapped by this provider.
// By using this AuthContext, you can manage the authentication state in your application and provide authentication-related functionality to any component that needs it.
