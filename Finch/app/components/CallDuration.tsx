import React from "react"

import { ICall } from "../models/Call"
import { runGetDurationTime } from "../utils/useFormatDate"
import { Text, TextProps } from "./Text"

interface IProps extends TextProps {
  duration: ICall["CallDurationTime"]
}

export const CallDuration = ({ duration, ...rest }: IProps) => {
  const [durationDisplay, setDurationDisplay] = React.useState("")

  React.useEffect(() => {
    let durationDisplayUpdate = duration

    if (durationDisplayUpdate) {
      try {
        durationDisplayUpdate = runGetDurationTime(parseInt(durationDisplayUpdate))
      } catch (error) {}
    }

    setDurationDisplay(durationDisplayUpdate)
  }, [duration])

  return <Text {...rest}>{durationDisplay || "--:--"}</Text>
}
