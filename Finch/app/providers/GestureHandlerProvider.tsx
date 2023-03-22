import { GestureHandlerRootView } from "react-native-gesture-handler"
interface IProps {
  children?: React.ReactNode
}

function GestureHandlerProvider(props: IProps) {
  return <GestureHandlerRootView style={{ flex: 1 }}>{props.children}</GestureHandlerRootView>
}

export default GestureHandlerProvider
