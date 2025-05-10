import { useEffect, useState } from 'react';

export default function useGetData({ isOne = false, fn, dependencies = [] }) {
    const [data, setData] = useState(isOne ? null : []);
    const [loading, setLoading] = useState(true); // start as loading
    const [error, setError] = useState({ status: false, message: '' });

    async function getData() {
        setLoading(true);
        setError({ status: false, message: '' });

        try {
            const res = await fn();
            setData(res);
        } catch (err) {
            console.log(err);
            setError({
                status: true,
                message: err.message || 'حدث خطأ أثناء تحميل البيانات'
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, [...dependencies]);

    return {
        data,
        loading,
        error
    };
}
