import { useEffect, useState } from 'react';
import { GET } from 'utils/api-calls';

/**
 * Use this hook only to Fetch data using simple GET requests
 * @param {string} endpoint to which the API requst is to be made
 */
function useQuery(endpoint) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [data, setData] = useState(null);

	useEffect(() => {
		const makeReq = async () => {
			try {
				const resData = await GET(endpoint);
				setData(resData);
				setLoading(false);
				setError(false);
			} catch (e) {
				setLoading(false);
				setError(e.response?.data?.message);
			}
		};
		makeReq();
	}, [endpoint]);

	return {
		loading,
		error,
		data,
	};
}

export default useQuery;
