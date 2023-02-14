import NativeBaseProvider from "./NativeBaseProvider"

interface IProps {
  children?: React.ReactNode
}

function AppProviders(props: IProps) {
  return <NativeBaseProvider>{props.children}</NativeBaseProvider>
}

export default AppProviders
