import { useState } from "react";
import axios from "axios";

const useRegister = () => {
	const [error, setError] = useState("");
	const [redirect, setRedirect] = useState(false);

	const registerUser = async (userData) => {
		try {
			const response = await axios.post(
				"http://localhost:3001/Register",
				userData
			);
			setRedirect(true);
			return response.data;
		} catch (err) {
			console.error("Registration failed:", err);
			if (err.response && err.response.data) {
				setError(err.response.data.message);
			} else {
				setError("An unknown error occurred.");
			}
		}
	};

	return { error, redirect, registerUser };
};

export default useRegister;
