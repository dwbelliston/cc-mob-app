import { API } from "@aws-amplify/api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IPaginatedContacts } from "../../../../models/Contact"

import { APIEndpoints } from "../../config"
import { contactsKeys, IContactsListFilterProps } from "../contacts"

interface IProps extends IContactsListFilterProps {
  pageCursor?: any
}

const makeApiRequest = (props: IProps): Promise<IPaginatedContacts> => {
  const qParams = {
    queryStringParameters: {
      // Add if no cursor
      ...(!props.pageCursor && { limit: props.pageLimit }),
      // Just use cursor
      ...(props.pageCursor && { cursor: props.pageCursor }),
    },
  } as any

  if (!props.pageCursor && props.filters && props.filters.length) {
    qParams.queryStringParameters = {
      ...qParams.queryStringParameters,
      useFilter: props.filters.map((filter) =>
        [filter.field, filter.operator, filter.value].join(":"),
      ),
    }
  }

  return API.get(APIEndpoints.authenticatedContacts, "/api/v1/contacts/", qParams)
}

const useListContacts = (props: IContactsListFilterProps) => {
  return useInfiniteQuery<IPaginatedContacts, AxiosError>(
    contactsKeys.list({
      pageLimit: props.pageLimit,
      filters: props.filters,
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

export default useListContacts
