import { QueryCache, QueryClient } from "@tanstack/react-query"
import { observer } from "mobx-react-lite"
import React from "react"
import * as Sentry from "sentry-expo"
import { useStores } from "../models"

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"

interface IProps {
  children: any
}

const ReactQueryProvider: React.FC<IProps> = observer(function ReactQueryProvider({
  children,
}: IProps) {
  const {
    authenticationStore: { userId, logout },
  } = useStores()

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error: any) => {
        try {
          Sentry.Native.captureException(error)
          if (error === "No current user") {
            logout()
          }
        } catch (e) {}
      },
    }),
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        staleTime: 4000,
      },
    },
  })

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
  })

  React.useEffect(() => {
    if (!userId) {
      queryClient.clear()
    }
  }, [userId])

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
    </PersistQueryClientProvider>
  )
})

export { ReactQueryProvider }
