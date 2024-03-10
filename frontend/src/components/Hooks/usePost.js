import { useState } from "react";
import axios from "axios";

function usePost(url, initialData = null) {
	const [data, setData] = useState(initialData);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchData = async (requestData) => {
		try {
			setLoading(true); // Set loading to true before making the request
			const response = await axios.post(url, requestData);
			setData(response.data);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false); // Set loading to false after the request is completed (success or error)
		}
	};

	return { data, loading, error, fetchData };
}

export default usePost;
