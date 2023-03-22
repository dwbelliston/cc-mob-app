import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { AuthProvider } from "./AuthProvider"
import GestureHandlerProvider from "./GestureHandlerProvider"
import NativeBaseProvider from "./NativeBaseProvider"
import { ReactQueryProvider } from "./ReactQueryProvider"

interface IProps {
  children?: React.ReactNode
}

function AppProviders(props: IProps) {
  return (
    <GestureHandlerProvider>
      <ActionSheetProvider>
        <NativeBaseProvider>
          <ReactQueryProvider>
            <BottomSheetModalProvider>
              <AuthProvider>{props.children}</AuthProvider>
            </BottomSheetModalProvider>
          </ReactQueryProvider>
        </NativeBaseProvider>
      </ActionSheetProvider>
    </GestureHandlerProvider>
  )
}

export default AppProviders
