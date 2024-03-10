import { useState, useEffect } from "react";
import axios from "axios";

function useFetch(url) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await axios.get(url);
				setData(response.data);
			} catch (error) {
				setError(error);
			} finally {
				// console.log("this:", url);
				setLoading(false);
			}
		};
		fetchData();
	}, [url]);

	return { data, loading, error };
}

export default useFetch;
