import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { AuthProvider } from "./AuthProvider"
import NativeBaseProvider from "./NativeBaseProvider"
import { ReactQueryProvider } from "./ReactQueryProvider"

interface IProps {
  children?: React.ReactNode
}

function AppProviders(props: IProps) {
  return (
    <ActionSheetProvider>
      <NativeBaseProvider>
        <BottomSheetModalProvider>
          <ReactQueryProvider>
            <AuthProvider>{props.children}</AuthProvider>
          </ReactQueryProvider>
        </BottomSheetModalProvider>
      </NativeBaseProvider>
    </ActionSheetProvider>
  )
}

export default AppProviders
