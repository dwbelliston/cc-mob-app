import { ActionSheetProvider } from "@expo/react-native-action-sheet"
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
        <ReactQueryProvider>
          <AuthProvider>{props.children}</AuthProvider>
        </ReactQueryProvider>
      </NativeBaseProvider>
    </ActionSheetProvider>
  )
}

export default AppProviders
