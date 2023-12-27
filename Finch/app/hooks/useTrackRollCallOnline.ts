import { useEffect } from 'react';
import usePostRollCallOnline from '../services/api/rollcall/mutations/usePostRollCallOnline';

const INTERVAL_SECONDS = 30000

const useTrackRollCallOnline = () => {

  const {mutateAsync: mutateAsyncOnline} = usePostRollCallOnline()

  useEffect(() => {
    // Function to make the API call
    const fetchData = async () => {

      try {
        // Make your API call here
        await mutateAsyncOnline()
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function immediately
    fetchData();

    // Set up an interval to make the API call
    const intervalId = setInterval(fetchData, INTERVAL_SECONDS);

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Include dependencies in the array if needed

  return null;
};

export default useTrackRollCallOnline;
