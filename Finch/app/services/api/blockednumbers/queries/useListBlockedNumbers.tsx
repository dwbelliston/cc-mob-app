import { API } from "@aws-amplify/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import React from "react"
import { IPaginatedBlockedNumbers } from "../../../../models/BlockedNumber"
import { APIEndpoints, QueryKeys } from "../../config"

const makeApiRequest = (fetchCursor: string | undefined, pageLimit = 99, search?: string) => {
  const qParams = {
    queryStringParameters: {
      ...(!fetchCursor && { limit: pageLimit }),
      ...(!fetchCursor && search && { search: search.toLowerCase() }),
      ...(fetchCursor && { cursor: fetchCursor }),
    },
  }

  return API.get(APIEndpoints.authenticatedOutbounds, "/api/v1/blockednumbers/", qParams)
}

const useListBlockedNumbers = (pageLimit: number, search?: string) => {
  const queryClient = useQueryClient()

  const [activePage, set_activePage] = React.useState(1)
  const [hasNext, set_hasNext] = React.useState(false)

  const queryProps = useQuery<IPaginatedBlockedNumbers>(
    QueryKeys.blockednumbersList({
      pageLimit,
      pageNumber: activePage,
      search,
    }),
    () => {
      const previousPage = activePage - 1

      const data = queryClient.getQueryData<IPaginatedBlockedNumbers>(
        QueryKeys.blockednumbersList({
          pageLimit,
          pageNumber: previousPage,
          search,
        }),
      )

      const useCursor = data?.meta?.cursor
      return makeApiRequest(useCursor, pageLimit, search)
    },
    {
      keepPreviousData: true,
      staleTime: 30000,
    },
  )

  // Watch inputs that need to trigger a reset back to page 1
  React.useEffect(() => {
    queryClient.cancelQueries(QueryKeys.blockednumbers(), {
      exact: false,
    })
    queryClient.removeQueries(QueryKeys.blockednumbers(), {
      exact: false,
    })
    set_activePage(1)
  }, [search])

  // Watch inputs that need to trigger a reset back to page 1
  React.useEffect(() => {
    queryClient.cancelQueries(QueryKeys.blockednumbers(), {
      exact: false,
    })
    queryClient.removeQueries(QueryKeys.blockednumbers(), {
      exact: false,
    })
    set_activePage(1)
  }, [pageLimit])

  React.useEffect(() => {
    // If data is available, then we are coming back to the page and we from the cache
    if (queryProps.data) {
      // Watch data, this can help us know to update the 'hasNext'
      // since data will be representative of the active page
      // if a cursor is on the data, offer a next page
      if (queryProps.data?.meta.cursor) {
        set_hasNext(true)
      } else {
        set_hasNext(false)
      }
    }
  }, [queryProps.data])

  const getPrevious = () => {
    // Handles moving to next page
    if (!queryProps.isFetching && activePage > 1) {
      set_activePage(activePage - 1)
    }
  }

  const getNext = () => {
    // Handles moving to next page
    if (!queryProps.isFetching && hasNext) {
      set_activePage(activePage + 1)
    }
  }
  const onRefresh = () => {
    // Handles moving to first page
    queryClient.cancelQueries(QueryKeys.blockednumbers(), {
      exact: false,
    })
    queryClient.removeQueries(QueryKeys.blockednumbers(), {
      exact: false,
    })

    set_activePage(1)

    if (!queryProps.isFetching) {
      setTimeout(() => {
        queryProps.refetch()
      }, 0)
    }
  }

  const hasPrevious = activePage > 1

  return {
    // useQuery
    ...queryProps,
    // Custom
    hasPrevious,
    hasNext,
    currentPage: activePage,
    pageLimit,
    onRefresh,
    getNext,
    getPrevious,
  }
}

export default useListBlockedNumbers
