/*
AudioRecording
*/

import React from "react"

import { Audio, AVPlaybackStatusError, AVPlaybackStatusSuccess } from "expo-av"
import { Box, HStack, Slider, Spinner, useColorModeValue, View } from "native-base"
import { spacing } from "../theme"
import { useColor } from "../theme/useColor"
import { millisToMinutesAndSeconds } from "../utils/formatDate"
import { Icon } from "./Icon"
import { IconButton } from "./IconButton"
import { Text } from "./Text"

interface IProps {
  recordingUrl?: string
}

export const AudioRecording = ({ recordingUrl }: IProps) => {
  const [sound, setSound] = React.useState<any>()
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const [isBuffering, setIsBuffering] = React.useState<boolean>(false)
  const [positionMillis, setPositionMillis] = React.useState<number>(0)
  const [durationMillis, setDurationMillis] = React.useState<number>(0)
  const [duration, setDuration] = React.useState<string>("-- / --")
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  const bgMain = useColor("bg.high")
  const cardBorder = useColorModeValue("gray.200", "gray.700")

  const _onPlaybackStatusUpdate = (
    playbackStatus: AVPlaybackStatusError | AVPlaybackStatusSuccess,
  ) => {
    console.log("_onPlaybackStatusUpdate", playbackStatus)

    if ((playbackStatus as AVPlaybackStatusSuccess).isPlaying !== undefined) {
      const successStatus = playbackStatus as AVPlaybackStatusSuccess
      setIsLoaded(successStatus.isLoaded)

      if (!successStatus.isLoaded) {
        // Update your UI for the unloaded state
      } else {
        // Update your UI for the loaded state
        setIsPlaying(successStatus.isPlaying)
        setIsBuffering(successStatus.isBuffering)

        setPositionMillis(successStatus.positionMillis)
        setDurationMillis(successStatus.durationMillis)

        const track = millisToMinutesAndSeconds(successStatus.positionMillis)
        const total = millisToMinutesAndSeconds(successStatus.durationMillis)
        const durationUpdate = `${track} / ${total}`
        setDuration(durationUpdate)
      }
    } else {
    }
  }

  const handleOnChange = async (evt) => {
    console.log(evt)
    if (sound) {
      sound.setPositionAsync(evt)
    }
  }

  const pauseSound = async () => {
    if (sound) {
      sound.pauseAsync()
    }
  }

  const loadAndPlay = async () => {
    if (!isBuffering) {
      setIsBuffering(true)

      const sound = new Audio.Sound()

      setSound(sound)

      sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate)

      await sound.loadAsync({
        uri: recordingUrl,
      })

      await sound.playAsync()
    }
  }

  const playSound = async () => {
    if (!isBuffering) {
      if (sound) {
        const status = await sound.getStatusAsync()

        if (status.isLoaded && status.positionMillis == status.durationMillis) {
          await sound.setPositionAsync(0)
          await sound.playAsync()
        } else if (status.isLoaded) {
          await sound.playAsync()
        } else {
          loadAndPlay()
        }
      } else {
        loadAndPlay()
      }
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound")
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  return (
    <View
      bg={bgMain}
      w="full"
      rounded="lg"
      borderWidth={1}
      borderColor={cardBorder}
      px={spacing.tiny}
      py={spacing.micro}
    >
      <HStack w="full" alignItems={"center"} space={spacing.tiny} justifyContent="space-between">
        {isPlaying ? (
          <IconButton
            size="sm"
            onPress={pauseSound}
            rounded="full"
            icon={<Icon colorToken="text" icon="pause" size={16} />}
          ></IconButton>
        ) : (
          <IconButton
            size="sm"
            isDisabled={isBuffering}
            onPress={playSound}
            rounded="full"
            icon={<Icon colorToken="text" icon="play" size={16} />}
          ></IconButton>
        )}
        {isBuffering ? (
          <Box>
            <Spinner></Spinner>
          </Box>
        ) : null}
        <Slider
          isDisabled={!isLoaded}
          onChange={handleOnChange}
          flex={1}
          value={positionMillis}
          minValue={0}
          maxValue={durationMillis}
          accessibilityLabel="Audio location"
          step={1000}
        >
          <Slider.Track>
            <Slider.FilledTrack />
          </Slider.Track>
          <Slider.Thumb />
        </Slider>
        <Box>
          <Text text={duration} />
        </Box>
      </HStack>
    </View>
  )
}
