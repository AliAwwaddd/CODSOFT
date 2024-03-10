import { useState } from "react";
import axios from "axios";

function useDeleteTask() {
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
    
    const deleteTask = async (id) => {
        try {
            setLoading(true);
            const response = await axios.delete(`http://localhost:3001/project/deleteTask/${id}`);
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

	return { data, loading, error, deleteTask };
}
export default useDeleteTask;
