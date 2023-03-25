import { API } from "@aws-amplify/api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IPaginatedBroadcasts } from "../../../../models/Broadcast"

import { APIEndpoints } from "../../config"
import { broadcastsKeys, IBroadcastsListFilterProps } from "../broadcasts"

interface IProps extends IBroadcastsListFilterProps {
  pageCursor?: any
}

const makeApiRequest = (props: IProps): Promise<IPaginatedBroadcasts> => {
  const qParams = {
    queryStringParameters: {
      // Add if no cursor
      ...(!props.pageCursor && { limit: props.pageLimit }),
      ...(!props.pageCursor && props.status && { status: props.status }),
      // Just use cursor
      ...(props.pageCursor && { cursor: props.pageCursor }),
    },
  } as {}

  return API.get(APIEndpoints.authenticatedCampaigns, "/api/v1/broadcasts/", qParams)
}

const useListBroadcasts = (props: IBroadcastsListFilterProps) => {
  return useInfiniteQuery<IPaginatedBroadcasts, AxiosError>(
    broadcastsKeys.list({
      pageLimit: props.pageLimit,
      status: props.status,
    }),
    (_props) => {
      return makeApiRequest({
        ...props,
        pageCursor: _props.pageParam,
      })
    },
    {
      getPreviousPageParam: (firstPage) => firstPage.meta.cursor ?? false,
      getNextPageParam: (lastPage) => lastPage.meta.cursor ?? false,
      refetchInterval: 1000 * 15,
      retry: 2,
    },
  )
}

export default useListBroadcasts
