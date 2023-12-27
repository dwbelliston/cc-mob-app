import { useEffect } from 'react';

import { IRollCallConversationUpdate } from '../models/RollCall';
import { runGetTeammemberUserId } from '../models/UserProfile';
import usePostRollCallConversation from '../services/api/rollcall/mutations/usePostRollCallConversation';
import useReadUserProfile from '../services/api/userprofile/queries/useReadUserProfile';


const INTERVAL_SECONDS = 30000

const useTrackRollCallConversation = (conversationId?: string |null, isTyping?: boolean) => {

  const {data: userProfile} = useReadUserProfile()
  const teammemberId = runGetTeammemberUserId(userProfile);

  const {mutateAsync: mutateAsyncOnline} = usePostRollCallConversation()

  // Function to make the API call
  const fetchData = async () => {

    if (conversationId) {
      try {
        const postBody: IRollCallConversationUpdate= {
          ConversationId: conversationId,
          IsTyping: isTyping
        }

        // Make your API call here
        if (teammemberId) {
          await mutateAsyncOnline({teammemberId, updateData: postBody})
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

    }

  };

  useEffect(() => {
    // Call fetchData immediately when the component mounts
    fetchData();

    // Set up an interval to call fetchData every N seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, INTERVAL_SECONDS);

    // Clean up the interval on component unmount or when the dependency changes
    return () => {
      clearInterval(intervalId);
    };
  }, [conversationId, isTyping]); // Is id or typing status change, fire it off


  return null;
};

export default useTrackRollCallConversation;
