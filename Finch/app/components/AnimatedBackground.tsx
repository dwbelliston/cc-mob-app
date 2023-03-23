import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"

import { ColorTokenOption, useColor } from "../theme/useColor"

interface IAnimatedBackground {
  sharedValue: SharedValue<number>
  bgStart?: ColorTokenOption
  bgEnd?: ColorTokenOption
  styles?: any
  children?: React.ReactNode
}

export const AnimatedBackground = ({
  sharedValue,
  bgStart = "bg.animStart",
  bgEnd = "bg.animEnd",
  styles,
  children,
}: IAnimatedBackground) => {
  const bgPill = useColor(bgStart)
  const bgTempPill = useColor(bgEnd)

  const animatedBgStyles = useAnimatedStyle(() => {
    const color = interpolateColor(sharedValue.value, [0, 1], [bgPill, bgTempPill])

    return {
      backgroundColor: withTiming(
        color,
        {
          duration: 250,
        },
        () => {
          if (sharedValue) {
            sharedValue.value = 0
          }
        },
      ),
    }
  })

  return (
    <Animated.View
      style={[
        {
          width: "100%",
          backgroundColor: bgPill,
          ...styles,
        },
        [animatedBgStyles],
      ]}
    >
      {children}
    </Animated.View>
  )
}
