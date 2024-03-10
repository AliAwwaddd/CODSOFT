import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const useIsCreator = (projectId) => {
	const { userData } = useAuth();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				// console.log("userId:", userData.userId, "projectId:", projectId);
				const response = await axios.get(
					`http://localhost:3001/project/${userData.userId}/${projectId}`
				);
				// console.log(response.data);
				setData(response.data);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [projectId, userData.userId]);

	return { data, loading, error };
};

export default useIsCreator;
