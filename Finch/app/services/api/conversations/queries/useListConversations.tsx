import { useInfiniteQuery } from "@tanstack/react-query"
import { API } from "aws-amplify"

import { ConversationStatusEnum, IPaginatedConversations } from "../../../../models/Conversation"
import { APIEndpoints, QueryKeys } from "../../config"

interface IQueryProps {
  pageLimit: number
  search: string | null
  isUnread: boolean | null
  fromFolderId: string | null
  conversationStatus: ConversationStatusEnum | null
}

interface IProps extends IQueryProps {
  pageCursor?: any
}

// const makeApiRequest = (props: IProps): Promise<IPaginatedConversations> => {
const makeApiRequest = (props: IProps) => {
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

const useListConversations = (props: IQueryProps) => {
  return useInfiniteQuery<IPaginatedConversations>(
    QueryKeys.conversationsList({
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
      refetchInterval: 15000,
      retry: 2,
    },
  )
}

export default useListConversations
