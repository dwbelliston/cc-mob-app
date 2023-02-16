import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { observer } from "mobx-react-lite"
import React from "react"
// import * as Sentry from "sentry-expo";
import { useStores } from "../models"

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
          // Sentry.Native.captureException(error);
          if (error === "No current user") {
            logout()
          }
        } catch (e) {}
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 4000,
      },
    },
  })

  React.useEffect(() => {
    if (!userId) {
      queryClient.clear()
    }
  }, [userId])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
})

export { ReactQueryProvider }
