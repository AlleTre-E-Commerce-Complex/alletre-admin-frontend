import React from "react";

function useSafeDispatch(dispatch) {
  const mounted = React.useRef(false);
  React.useLayoutEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);
  return React.useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch]
  );
}

const defaultInitialState = { status: "idle", data: null, error: null };

function useAxios(initialState) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  });
  const [{ status, data, error }, setState] = React.useReducer(
    (s, a) => ({ ...s, ...a }),
    initialStateRef.current
  );

  const safeSetState = useSafeDispatch(setState);

  const setData = React.useCallback(
    (data) => safeSetState({ data, status: "resolved" }),
    [safeSetState]
  );
  const setError = React.useCallback(
    (error) => safeSetState({ error, status: "rejected" }),
    [safeSetState]
  );
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  );

  const run = React.useCallback(
    (promise, config = {}) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAxios().run must be a promise. Maybe a function that's passed isn't returning anything?`
        );
      }
      safeSetState({ status: "pending" });
      return promise.then(
        (response) => {
          setData(response?.data?.data || response?.data);
          return response;
        },
        (error) => {
          console.log("useAxios Error:", error);

          // ✅ This gives you the actual requested URL
          const url = error?.config?.url;
          const method = error?.config?.method;
          console.log(`Axios error occurred on ${method?.toUpperCase()} ${url}`);
          const errorMessage = error?.response?.data;
          if (config.throwOnError) throw new Error(errorMessage);
          setError(errorMessage);
          return Promise.reject(errorMessage);
        }
      );
    },
    [safeSetState, setData, setError]
  );

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === "idle",
    isLoading: status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}

export default useAxios;
