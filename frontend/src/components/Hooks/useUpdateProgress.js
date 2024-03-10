import { useState } from "react";
import axios from "axios";

function useUpdateProgress() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (requestData) => {
        try {
            setLoading(true);
            const url = "http://localhost:3001/project/updateProgress";
            const response = await axios.post(url, requestData);
            setData(response.data);
        } catch (error) {
            // Set a specific error message based on the error type
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fetchData };
}

export default useUpdateProgress;
