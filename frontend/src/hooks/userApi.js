import { useState, useEffect } from 'react';

// Generic hook: pass a fetch function, get { data, loading, error, refetch }
const useApi = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchFn();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, deps);

  return { data, loading, error, refetch: load };
};

export default useApi;