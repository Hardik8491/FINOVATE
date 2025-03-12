import { useState } from "react";
import { toast } from "sonner";

interface UseFetchReturn<T, A extends unknown[]> {
    data: T | undefined;
    loading: boolean;
    error: Error | null;
    fn: (...args: A) => Promise<void>;
    setData: (data: T | undefined) => void;
}

const useFetch = <T, A extends unknown[]>(
    cb: (...args: A) => Promise<T>
): UseFetchReturn<T, A> => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fn = async (...args: A) => {
        setLoading(true);
        setError(null);

        try {
            const response = await cb(...args);
            setData(response);
        } catch (error) {
            const err = error as Error;
            setError(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fn, setData };
};

export default useFetch;
