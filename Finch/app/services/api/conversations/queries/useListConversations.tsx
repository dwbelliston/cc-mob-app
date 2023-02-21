import { API } from "@aws-amplify/api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

import { IPaginatedConversations } from "../../../../models/Conversation"
import { APIEndpoints } from "../../config"
import { conversationKeys, IConversationListFilterProps } from "../conversations"

interface IProps extends IConversationListFilterProps {
  pageCursor?: any
}

const makeApiRequest = (props: IProps): Promise<IPaginatedConversations> => {
  const qParams = {
    queryStringParameters: {
      // Add if no cursor
      ...(!props.pageCursor && { limit: props.pageLimit }),
      ...(!props.pageCursor && props.search && { search: props.search.toLowerCase() }),
      ...(!props.pageCursor && props.isUnread && { isUnread: props.isUnread }),
      ...(!props.pageCursor && props.fromFolderId && { folderId: props.fromFolderId }),
      ...(!props.pageCursor && props.conversationStatus && { status: props.conversationStatus }),
      // Just use cursor
      ...(props.pageCursor && { cursor: props.pageCursor }),
    },
  } as {}

  return API.get(APIEndpoints.authenticatedOutbounds, "/api/v1/conversations/", qParams)
}

const useListConversations = (props: IConversationListFilterProps) => {
  return useInfiniteQuery<IPaginatedConversations, AxiosError>(
    conversationKeys.list({
      pageLimit: props.pageLimit,
      search: props.search,
      isUnread: props.isUnread,
      fromFolderId: props.fromFolderId,
      conversationStatus: props.conversationStatus,
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

export default useListConversations
