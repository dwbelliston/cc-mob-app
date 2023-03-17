import { API } from "@aws-amplify/api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { IPaginatedBlockedNumbers } from "../../../../models/BlockedNumber"
import { APIEndpoints } from "../../config"
import { blockedNumbersKeys } from "../blockedNumbers"

interface IProps {
  pageCursor?: any
  search: string | null
}

const makeApiRequest = (props: IProps) => {
  const pageLimit = 50

  const qParams = {
    queryStringParameters: {
      ...(!props.pageCursor && { limit: pageLimit }),
      ...(!props.pageCursor && props.search && { search: props.search.toLowerCase() }),
      ...(props.pageCursor && { cursor: props.pageCursor }),
    },
  }

  return API.get(APIEndpoints.authenticatedOutbounds, "/api/v1/blockednumbers/", qParams)
}

const useListBlockedNumbers = (search: string | null = null) => {
  return useInfiniteQuery<IPaginatedBlockedNumbers>(
    blockedNumbersKeys.list({ search }),
    (props) => {
      return makeApiRequest({
        pageCursor: props.pageParam,
        search,
      })
    },
    {
      getPreviousPageParam: (firstPage) => {
        return firstPage.meta.cursor ? firstPage.meta.cursor : false
      },
      getNextPageParam: (lastPage) => {
        return lastPage.meta.cursor ? lastPage.meta.cursor : false
      },
      refetchInterval: 5000,
      retry: 2,
    },
  )
}

export default useListBlockedNumbers
