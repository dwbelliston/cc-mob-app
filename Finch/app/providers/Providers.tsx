import { AuthProvider } from "./AuthProvider"
import NativeBaseProvider from "./NativeBaseProvider"

interface IProps {
  children?: React.ReactNode
}

function AppProviders(props: IProps) {
  return (
    <NativeBaseProvider>
      <AuthProvider>{props.children}</AuthProvider>
    </NativeBaseProvider>
  )
}

export default AppProviders
