import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IUserProfile, IUserProfileUpdateForm } from "../../../../models/UserProfile"
import { APIEndpoints } from "../../config"
import { userprofileKeys } from "../userprofile"

const makeApiRequest = (userProfileForm: IUserProfileUpdateForm): Promise<IUserProfile> => {
  const reqData = {
    body: userProfileForm,
  }
  return API.put(APIEndpoints.authenticatedUsers, `/api/v1/profile`, reqData)
}

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation<IUserProfile, AxiosError, IUserProfileUpdateForm>(
    (userProfileForm) => makeApiRequest(userProfileForm),
    {
      retry: 0,
      onMutate: async (updatedProfile) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(userprofileKeys.myProfile())

        // Snapshot the previous value
        const previousRecord = queryClient.getQueryData(userprofileKeys.myProfile())

        // Optimistically update to the new value
        queryClient.setQueryData(userprofileKeys.myProfile(), (old: any) => {
          return {
            ...old,
            ...updatedProfile,
          }
        })

        // Return a context object with the snapshotted value
        return { previousRecord }
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, _newPost, context: any) => {
        queryClient.setQueryData(userprofileKeys.myProfile(), context.previousRecord)
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(userprofileKeys.myProfile())
      },
    },
  )
}

export default useUpdateUserProfile
