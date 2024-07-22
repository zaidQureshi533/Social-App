import React, { useEffect, useState } from "react";

const FetchedData = (url, WrappedComponent) => {
  const withFetching = (props) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchUrl = async () => {
        try {
          const response = await fetch(url);
          const result = await response.json();
          setData(result);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      fetchUrl();
    }, [url]);

    return (
      <WrappedComponent
        data={data}
        loading={loading}
        error={error}
        {...props}
      />
    );
  };
  return withFetching;
};

export default FetchedData;
