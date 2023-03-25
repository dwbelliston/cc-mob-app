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
  bgStartColor?: string
  bgEnd?: ColorTokenOption
  bgEndColor?: string
  styles?: any
  children?: React.ReactNode
}

export const AnimatedBackground = ({
  sharedValue,
  bgStart,
  bgStartColor,
  bgEnd,
  bgEndColor,
  styles,
  children,
}: IAnimatedBackground) => {
  if (!bgStartColor) {
    if (!bgStart) bgStart = "bg.animStart"
    bgStartColor = useColor(bgStart)
  }
  if (!bgEndColor) {
    if (!bgEnd) bgEnd = "bg.animEnd"
    bgEndColor = useColor(bgEnd)
  }

  const animatedBgStyles = useAnimatedStyle(() => {
    const color = interpolateColor(sharedValue.value, [0, 1], [bgStartColor, bgEndColor])

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
          backgroundColor: bgStartColor,
          ...styles,
        },
        [animatedBgStyles],
      ]}
    >
      {children}
    </Animated.View>
  )
}
