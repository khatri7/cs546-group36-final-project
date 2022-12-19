import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET, handleError } from 'utils/api-calls';

/**
 * Use this hook only to Fetch data using simple GET requests
 * @param {string} endpoint to which the API requst is to be made
 */
function useQuery(endpoint) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [data, setData] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const makeReq = async () => {
			try {
				const res = await GET(endpoint);
				setData(res);
				setLoading(false);
				setError(false);
			} catch (e) {
				setData(null);
				setLoading(false);
				if (typeof handleError(e) === 'string') setError(handleError(e));
				else setError('Unkown error occured');
				if (e.response?.status === 404)
					navigate('/404', {
						state: { message: handleError(e) },
					});
			}
		};
		makeReq();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [endpoint]);

	return {
		loading,
		error,
		data,
	};
}

export default useQuery;
