import { useState } from "react";
import axios from "axios";

function useGetChangedTask(url) {
	const [data, setData] = useState();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchData = async (id, newDescription) => {
		try {
			setLoading(true); // Set loading to true before making the request
			const response = await axios.post(
				`http://localhost:3001/project/editTaskDescription`,
				{ taskId: id, newDescription: newDescription }
			);
			console.log(response);
			setData(response);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, fetchData };
}
export default useGetChangedTask;
