import { useInfiniteQuery } from "@tanstack/react-query"
import { API } from "aws-amplify"

import { ConversationStatusEnum, IPaginatedConversations } from "../../../../models/Conversation"
import { APIEndpoints, QueryKeys } from "../../config"

interface IProps {
  pageLimit?: any
  pageCursor?: any
  search: string | null
  isUnread: boolean | null
  fromFolderId: string | null
  conversationStatus: ConversationStatusEnum | null
}

// const makeApiRequest = (props: IProps): Promise<IPaginatedConversations> => {
const makeApiRequest = (props: IProps) => {
  const qParams = {
    queryStringParameters: {
      ...(!props.pageCursor && { limit: props.pageLimit }),
      ...(!props.pageCursor && props.search && { search: props.search.toLowerCase() }),
      ...(!props.pageCursor && props.isUnread && { isUnread: props.isUnread }),
      ...(!props.pageCursor && props.fromFolderId && { folderId: props.fromFolderId }),
      ...(!props.pageCursor && props.conversationStatus && { status: props.conversationStatus }),
      ...(props.pageCursor && { cursor: props.pageCursor }),
    },
  } as {}

  return API.get(APIEndpoints.authenticatedOutbounds, "/api/v1/conversations/", qParams)
}

const useListConversations = (
  pageLimit: number,
  search: string | null = null,
  isUnread: boolean | null = null,
  fromFolderId: string | null = null,
  conversationStatus: ConversationStatusEnum | null = null,
) => {
  return useInfiniteQuery<IPaginatedConversations>(
    [QueryKeys.conversations(), search, isUnread, fromFolderId, conversationStatus],
    (props) => {
      return makeApiRequest({
        pageLimit,
        pageCursor: props.pageParam,
        search,
        isUnread,
        fromFolderId,
        conversationStatus,
      })
    },
    {
      getPreviousPageParam: (firstPage) => firstPage.meta.cursor ?? false,
      getNextPageParam: (lastPage) => lastPage.meta.cursor ?? false,
      refetchInterval: 15000,
      retry: 2,
    },
  )
}

export default useListConversations
