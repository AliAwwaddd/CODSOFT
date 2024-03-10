import { useState } from "react";
import axios from "axios";

const usePostComment = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	const postComment = async (userId, taskId, comment, projectId, onSuccess) => {
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post(
				"http://localhost:3001/project/tasks/insertComment",
				{
					userId,
					taskId,
					comment,
					projectId,
				}
			);
			setData(response.data);
			onSuccess(); // Call the onSuccess callback
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	return { loading, error, data, postComment };
};

export default usePostComment;
