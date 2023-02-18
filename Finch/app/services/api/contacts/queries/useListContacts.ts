import { API } from "@aws-amplify/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import React from "react";
import { IContactFilter, IPaginatedContacts } from "../../../../models/Contact";
import { runIsEqualArrays } from "../../../../utils/useCompareArray";
import { APIEndpoints, QueryKeys } from "../../config";


const fetchContacts = (
  fetchCursor,
  pageLimit = 99,
  useFilters?: IContactFilter[]
) => {
  const qParams = {
    queryStringParameters: {
      ...(!fetchCursor && { limit: pageLimit }),
      ...(fetchCursor && { cursor: fetchCursor }),
    },
  } as any;

  if (!fetchCursor && useFilters && useFilters.length) {
    qParams.queryStringParameters = {
      ...qParams.queryStringParameters,
      useFilter: useFilters.map((filter) =>
        [filter.field, filter.operator, filter.value].join(":")
      ),
    };
  }

  return API.get(APIEndpoints.authenticatedContacts, "/api/v1/contacts/", qParams);
};

const useListContacts = (
  pageLimit: number,
  useFilters?: IContactFilter[],
  isEnabled = true
) => {
  const queryClient = useQueryClient();

  const [activePage, set_activePage] = React.useState(1);
  const [hasNext, set_hasNext] = React.useState(false);
  const [queryFilters, setQueryFilters] = React.useState<
    IContactFilter[] | undefined
  >(useFilters);

  const resQuery = useQuery<IPaginatedContacts, AxiosError>(
    QueryKeys.contactsList({
      pageLimit,
      pageNumber: activePage,
      queryFilters,
    }),
    () => {
      const previousPage = activePage - 1;
      const data = queryClient.getQueryData(
        QueryKeys.contactsList({
          pageLimit,
          pageNumber: previousPage,
          queryFilters,
        })
      );
      const useCursor = (data as any)?.meta?.cursor;
      return fetchContacts(useCursor, pageLimit, queryFilters);
    },
    {
      enabled: isEnabled,
      keepPreviousData: true,
      staleTime: 30000,
    }
  );

  // Watch inputs that need to trigger a reset back to page 1
  React.useEffect(() => {
    if (!runIsEqualArrays(queryFilters, useFilters)) {
      setQueryFilters(useFilters);
      queryClient.cancelQueries(QueryKeys.contacts(), {
        exact: false,
      });
      queryClient.removeQueries(QueryKeys.contacts(), {
        exact: false,
      });
      set_activePage(1);
    }
  }, [useFilters]);

  // Watch inputs that need to trigger a reset back to page 1
  React.useEffect(() => {
    queryClient.cancelQueries(QueryKeys.contacts(), {
      exact: false,
    });
    queryClient.removeQueries(QueryKeys.contacts(), {
      exact: false,
    });
    set_activePage(1);
  }, [pageLimit]);

  React.useEffect(() => {
    // If data is available, then we are coming back to the page and we from the cache
    if (resQuery.data) {
      // Watch data, this can help us know to update the 'hasNext'
      // since data will be representative of the active page
      // if a cursor is on the data, offer a next page
      if (resQuery.data?.meta.cursor) {
        set_hasNext(true);
      } else {
        set_hasNext(false);
      }
    }
  }, [resQuery.data]);

  const getPrevious = () => {
    // Handles moving to next page
    if (!resQuery.isFetching && activePage > 1) {
      set_activePage(activePage - 1);
    }
  };

  const getNext = () => {
    // Handles moving to next page
    if (!resQuery.isFetching && hasNext) {
      set_activePage(activePage + 1);
    }
  };

  const onRefresh = () => {
    // Handles moving to first page
    queryClient.cancelQueries(QueryKeys.contacts(), {
      exact: false,
    });
    queryClient.removeQueries(QueryKeys.contacts(), {
      exact: false,
    });

    set_activePage(1);

    if (!resQuery.isFetching) {
      setTimeout(() => {
        resQuery.refetch();
      }, 0);
    }
  };

  const hasPrevious = activePage > 1;

  return {
    // useQuery
    ...resQuery,
    // Custom
    hasPrevious,
    hasNext,
    currentPage: activePage,
    pageLimit,
    onRefresh,
    getNext,
    getPrevious,
  };
};

export default useListContacts;
