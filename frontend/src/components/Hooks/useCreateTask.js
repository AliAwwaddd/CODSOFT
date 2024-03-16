import { useState } from "react";
import axios from "axios";

function useCreateTask() {
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchData = async (requestData) => {
		try {
			setLoading(true);
			const url = "http://localhost:3001/project/addTaskWithUsers";
			const response = await axios.post(url, requestData);
			setData(response.data);
		} catch (error) {
			setError(error.response.data.message);
			throw error.response.data.message;
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, fetchData };
}

export default useCreateTask;
