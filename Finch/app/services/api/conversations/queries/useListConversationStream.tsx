import { API } from "@aws-amplify/api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IPaginatedConversationStream } from "../../../../models/Conversation"
import { APIEndpoints } from "../../config"
import { conversationKeys } from "../conversations"

interface IProps {
  pageLimit?: any
  conversationId?: any
  pageCursor?: any
  search: string | null
}

const makeApiRequest = (props: IProps) => {
  const qParams = {
    queryStringParameters: {
      ...(!props.pageCursor && { limit: props.pageLimit }),
      ...(!props.pageCursor && props.search && { search: props.search.toLowerCase() }),
      ...(props.pageCursor && { cursor: props.pageCursor }),
    },
  } as {}

  return API.get(
    APIEndpoints.authenticatedOutbounds,
    `/api/v1/conversations/${props.conversationId}/stream/`,
    qParams,
  )
}

const useListConversationStream = (
  pageLimit: number,
  conversationId?: string,
  search: string | null = null,
  refetchInterval: number = 5000,
) => {
  return useInfiniteQuery<IPaginatedConversationStream, AxiosError>(
    conversationKeys.stream(conversationId, search),
    (props) => {
      return makeApiRequest({
        conversationId,
        pageLimit,
        pageCursor: props.pageParam,
        search,
      })
    },
    {
      getPreviousPageParam: (firstPage) => {
        return conversationId && firstPage.meta.cursor ? firstPage.meta.cursor : false
      },
      getNextPageParam: (lastPage) => {
        return conversationId && lastPage.meta.cursor ? lastPage.meta.cursor : false
      },
      enabled: !!conversationId,
      refetchInterval: refetchInterval,
      retry: 2,
    },
  )
}

export default useListConversationStream
