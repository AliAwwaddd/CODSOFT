import { useState } from "react";
import axios from "axios";

function useDeleteComment() {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
    
    const deleteComment = async (commentId, taskId) => {
        try {
            setLoading(true);
            const response = await axios.delete(`http://localhost:3001/project/task/comment/${commentId}/${taskId}`);
            console.log(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

	return { loading, error, deleteComment };
}
export default useDeleteComment;
