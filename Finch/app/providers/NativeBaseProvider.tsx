import { extendTheme, NativeBaseProvider as NBProvider } from "native-base"
import { finchTheme } from "../theme/nativebase"

interface IProps {
  children?: React.ReactNode
}

export const theme = extendTheme(finchTheme)

function NativeBaseProvider(props: IProps) {
  return <NBProvider theme={theme}>{props.children}</NBProvider>
}

export default NativeBaseProvider
