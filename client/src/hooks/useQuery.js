import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GET, handleError } from 'utils/api-calls';

/**
 * Use this hook only to Fetch data using simple GET requests
 * @param {string} endpoint to which the API requst is to be made
 */
function useQuery(endpoint) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [data, setData] = useState(null);

	const user = useSelector((state) => state.user);

	useEffect(() => {
		const makeReq = async () => {
			try {
				const header = {};
				if (user?.token) header.Authorization = `Bearer ${user.token}`;
				const res = await GET(endpoint, {}, header);
				setData(res);
				setLoading(false);
				setError(false);
			} catch (e) {
				setData(null);
				setLoading(false);
				if (typeof handleError(e) === 'string') setError(handleError(e));
				else setError('Unkown error occured');
			}
		};
		makeReq();
	}, [endpoint, user?.token]);

	return {
		loading,
		error,
		data,
	};
}

export default useQuery;
