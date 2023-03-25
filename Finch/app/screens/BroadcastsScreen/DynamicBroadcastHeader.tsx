import { Center, HStack, Skeleton, Stack } from "native-base"
import { ImageBackground } from "react-native"
import { SharedValue } from "react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { Icon, IconButton, Text } from "../../components"
import { IBroadcast } from "../../models/Broadcast"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { BroadcastStatus } from "./BroadcastStatus"

const imgSrc = require("../../../assets/images/img-lines-header-light.png")

interface IProps {
  scrollY: SharedValue<number>
  bgColor: string
  topInset: number
  handleOnBack: () => void
  dataBroadcast?: IBroadcast
  isLoadingBroadcast: boolean
}
export const DynamicBroadcastHeader = ({
  scrollY,
  bgColor,
  topInset,
  handleOnBack,
  dataBroadcast,
  isLoadingBroadcast,
}: IProps) => {
  const textColor = useColor("text.light")

  const animateStartOffset = 100

  const animatedFontStyles = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, animateStartOffset], [1, 0.25], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    })

    return {
      opacity: withSpring(opacity, {
        overshootClamping: true,
      }),
    }
  })

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          backgroundColor: bgColor,
          // minHeight: 280,
        },
      ]}
    >
      <ImageBackground
        style={{
          paddingTop: topInset,
        }}
        source={imgSrc}
        resizeMode="cover"
      >
        <Stack
          h="full"
          pt={spacing.tiny}
          pb={spacing.small}
          space={spacing.extraSmall}
          px={spacing.tiny}
        >
          <HStack justifyContent={"space-between"}>
            <Center>
              <IconButton
                size="xs"
                onPress={handleOnBack}
                rounded="full"
                icon={<Icon size={20} colorToken="text" icon="arrowLeftLong" />}
              />
            </Center>
          </HStack>

          {isLoadingBroadcast && (
            <Stack space={spacing.tiny} py={spacing.tiny}>
              <Skeleton h="8" w="70%" rounded="sm" bgColor={bgColor} />
              <Skeleton h="6" w="20%" rounded="sm" bgColor={bgColor} />
            </Stack>
          )}

          {dataBroadcast && (
            <Stack space={spacing.micro}>
              <Animated.Text
                style={[
                  { fontSize: 30, color: textColor, fontWeight: "bold" },
                  [animatedFontStyles],
                ]}
              >
                {dataBroadcast.Title}
              </Animated.Text>

              <Stack>
                <Text colorToken={"text.light"}>{dataBroadcast.Description}</Text>

                <BroadcastStatus.Type
                  colorToken={"text.light"}
                  fontSize="sm"
                  status={dataBroadcast.Status}
                  dotProps={{ borderWidth: 1, borderColor: "primary.100", size: "lg" }}
                />
              </Stack>
            </Stack>
          )}
        </Stack>
      </ImageBackground>
    </Animated.View>
  )
}
