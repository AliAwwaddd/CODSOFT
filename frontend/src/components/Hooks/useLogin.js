import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const useLogin = () => {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();

	const loginUser = async (username, password) => {
		setLoading(true);
		try {
			const res = await axios.post("http://localhost:3001/login", {
				username,
				password,
			});
			login(res.data.userId, res.data.name);
		} catch (err) {
			if (err.response && err.response.data) {
				setError(err.response.data.message);
				throw err;
			} else {
				setError("An unknown error occurred.");
				throw err;
			}
		} finally {
			setLoading(false);
		}
	};

	return { error, loading, loginUser };
};

export default useLogin;
