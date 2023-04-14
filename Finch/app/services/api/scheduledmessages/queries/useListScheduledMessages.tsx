import { API } from "@aws-amplify/api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

import { IPaginatedScheduledMessages } from "../../../../models/ScheduledMessage"
import { APIEndpoints } from "../../config"
import { ISchedulesMessagesListFilterProps, scheduledMessagesKeys } from "../scheduledMessages"

interface IProps extends ISchedulesMessagesListFilterProps {
  pageCursor?: any
}

const makeApiRequest = (props: IProps): Promise<IPaginatedScheduledMessages> => {
  const qParams = {
    queryStringParameters: {
      // Add if no cursor
      ...(!props.pageCursor && { limit: props.pageLimit }),
      ...(!props.pageCursor && props.search && { search: props.search.toLowerCase() }),
      ...(!props.pageCursor &&
        props.isShowScheduledOnly && { isShowScheduledOnly: props.isShowScheduledOnly }),
      // Just use cursor
      ...(props.pageCursor && { cursor: props.pageCursor }),
    },
  } as {}

  return API.get(APIEndpoints.authenticatedShed, "/api/v1/scheduled-messages/", qParams)
}

const useListScheduledMessages = (props: ISchedulesMessagesListFilterProps) => {
  return useInfiniteQuery<IPaginatedScheduledMessages, AxiosError>(
    scheduledMessagesKeys.list(props),
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

export default useListScheduledMessages
