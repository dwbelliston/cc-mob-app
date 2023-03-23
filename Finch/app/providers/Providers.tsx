import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { AuthProvider } from "./AuthProvider"
import GestureHandlerProvider from "./GestureHandlerProvider"
import NativeBaseProvider from "./NativeBaseProvider"
import { NotificationsProvider } from "./NotificationsProvider"
import { ReactQueryProvider } from "./ReactQueryProvider"
import { SentryProvider } from "./SentryProvider"

interface IProps {
  children?: React.ReactNode
}

function AppProviders(props: IProps) {
  return (
    <SentryProvider>
      <GestureHandlerProvider>
        <ActionSheetProvider>
          <NativeBaseProvider>
            <ReactQueryProvider>
              <BottomSheetModalProvider>
                <NotificationsProvider>
                  <AuthProvider>{props.children}</AuthProvider>
                </NotificationsProvider>
              </BottomSheetModalProvider>
            </ReactQueryProvider>
          </NativeBaseProvider>
        </ActionSheetProvider>
      </GestureHandlerProvider>
    </SentryProvider>
  )
}

export default AppProviders
