import { AuthProvider } from "./AuthProvider"
import NativeBaseProvider from "./NativeBaseProvider"
import { ReactQueryProvider } from "./ReactQueryProvider"

interface IProps {
  children?: React.ReactNode
}

function AppProviders(props: IProps) {
  return (
    <NativeBaseProvider>
      <ReactQueryProvider>
        <AuthProvider>{props.children}</AuthProvider>
      </ReactQueryProvider>
    </NativeBaseProvider>
  )
}

export default AppProviders
