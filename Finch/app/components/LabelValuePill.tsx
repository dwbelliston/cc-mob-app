import * as Haptics from "expo-haptics"
import { Box, Button, HStack, IStackProps, Pressable, Stack } from "native-base"
import React from "react"
import { BusinessHourDaySchedule } from "../models/CallFlow"
import { IConnector, SUPPORTED_CRM_URLS } from "../models/Connector"
import { IContact, NumberCarrierTypeEnum, runFormatSourceDisplay } from "../models/Contact"
import { ITag } from "../models/Tag"
import { spacing } from "../theme"
import { ColorTokenOption, useColor } from "../theme/useColor"
import { runFormat24Hrto12Hr } from "../utils/useFormatDate"
import { AutoImage } from "./AutoImage"
import { ContactSourceAvatar } from "./ContactSourceAvatar"
import { CopyButton } from "./CopyButton"
import { Dot, IDotProps } from "./Dot"
import { Icon, IconProps } from "./Icon"
import { OpenMapButton } from "./OpenMapButton"
import { ShareButton } from "./ShareButton"
import { TagPill } from "./TagPill"
import { Text, TextProps } from "./Text"

import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { IBroadcast } from "../models/Broadcast"
import MessageMediaItemsPreview from "../screens/ConversationsScreen/MessageMediaItemsPreview"
import { Phone } from "./Phone"

export interface ILabelProps extends IStackProps {
  icon: IconProps["icon"]
  label: TextProps["tx"]
}

const PILL_STYLES = {
  rounded: "lg",
  py: spacing.tiny,
  px: spacing.tiny,
}

interface IAnimateBackground {
  sharedValue: SharedValue<number>
  bgStart?: ColorTokenOption
  bgEnd?: ColorTokenOption
  children
}

const AnimateBackground = ({
  sharedValue,
  bgStart = "bg.high",
  bgEnd = "bg.higher",
  children,
}: IAnimateBackground) => {
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
          backgroundColor: bgPill,
          borderRadius: 6,
          paddingVertical: spacing.medium,
          paddingHorizontal: spacing.medium,
        },
        [animatedBgStyles],
      ]}
    >
      {children}
    </Animated.View>
  )
}

const Label = ({ icon, label, ...rest }: ILabelProps) => {
  return (
    <HStack alignItems={"center"} space={spacing.micro} {...rest}>
      {icon && <Icon colorToken={"text.soft"} icon={icon} size={16} />}
      <Text colorToken="text.soft" preset="label" tx={label}></Text>
    </HStack>
  )
}

export interface ILabelValuePillTextProps extends IStackProps {
  icon?: IconProps["icon"]
  label: TextProps["tx"]
  text: TextProps["text"]
  isCopy?: boolean
  isShare?: boolean
  onEdit?: () => void
}

export const ValueText = ({
  label,
  icon,
  text,
  children,
  isCopy = false,
  isShare = false,
  onEdit,
  ...rest
}: ILabelValuePillTextProps) => {
  const progress = useSharedValue(0)

  const handleOnPress = () => {
    if (onEdit) {
      progress.value = 1
      Haptics.selectionAsync()
      onEdit()
    }
  }

  return (
    <Pressable onPress={handleOnPress}>
      <Stack space={1}>
        <HStack
          space={4}
          alignItems={"center"}
          justifyContent={"space-between"}
          px={spacing.micro}
          {...rest}
        >
          <Label icon={icon} label={label} />
          {text ? (
            <Button.Group size="md" variant="ghost" justifyContent={"flex-end"}>
              {isCopy ? <CopyButton text={text} /> : null}
              {isShare ? <ShareButton text={text} /> : null}
            </Button.Group>
          ) : null}
        </HStack>
        <AnimateBackground sharedValue={progress}>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            {text ? (
              <>
                <Text flex={1} fontSize="md" text={text}></Text>
              </>
            ) : (
              <Text flex={1} colorToken="text.softest" fontSize={"md"} tx={"common.noValue"}></Text>
            )}

            {onEdit ? (
              <Box>
                <Icon size={16} icon="pencilSquare" />
              </Box>
            ) : null}
          </HStack>
        </AnimateBackground>
      </Stack>
    </Pressable>
  )
}

export interface ILabelValuePillValuePhoneTypeProps extends IStackProps {
  icon?: IconProps["icon"]
  label: TextProps["tx"]
  phone: TextProps["text"]
  isCopy?: boolean
  carrierName: string
  carrierType: NumberCarrierTypeEnum
  isShare?: boolean
  dotProps?: IDotProps
  onEdit?: () => void
}

export const ValuePhoneType = ({
  label,
  icon,
  phone,
  children,
  isCopy = false,
  isShare = false,
  onEdit,
  carrierName,
  carrierType,
  dotProps,
  ...rest
}: ILabelValuePillValuePhoneTypeProps) => {
  const progress = useSharedValue(0)

  const handleOnPress = () => {
    if (onEdit) {
      progress.value = 1
      Haptics.selectionAsync()
      onEdit()
    }
  }

  return (
    <Pressable onPress={handleOnPress}>
      <Stack space={1}>
        <HStack
          space={4}
          alignItems={"center"}
          justifyContent={"space-between"}
          px={spacing.micro}
          {...rest}
        >
          <Label icon={icon} label={label} />
          {phone ? (
            <Button.Group size="md" variant="ghost" justifyContent={"flex-end"}>
              {isCopy ? <CopyButton text={phone} /> : null}
              {isShare ? <ShareButton text={phone} /> : null}
            </Button.Group>
          ) : null}
        </HStack>
        <AnimateBackground sharedValue={progress}>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Stack space={0} flex={1}>
              <Text flex={1} fontSize="md" text={phone}></Text>
              <Phone.Type numberCarrierType={carrierType} />
            </Stack>

            {onEdit ? (
              <Box>
                <Icon size={16} icon="pencilSquare" />
              </Box>
            ) : null}
          </HStack>
        </AnimateBackground>
      </Stack>
    </Pressable>
  )
}

export interface ILabelValuePillAddressProps extends IStackProps {
  icon?: IconProps["icon"]
  label: TextProps["tx"]
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  onEdit?: () => void
  isCopy?: boolean
  isShare?: boolean
  isOpen?: boolean
}

export const ValueAddress = ({
  label,
  icon,
  address1,
  address2,
  city,
  state,
  zip,
  children,
  isCopy = false,
  isShare = false,
  isOpen = false,
  onEdit,
  ...rest
}: ILabelValuePillAddressProps) => {
  const progress = useSharedValue(0)

  const line1 = address2 ? `${address1} ${address2}` : address1

  let line2 = ""

  if (city) {
    line2 = city
  }

  if (state) {
    line2 = line2 ? `${line2}, ${state}` : state
  }

  if (zip) {
    line2 = line2 ? `${line2} ${zip}` : zip
  }

  const singleVal = `${line1}\n${line2}`

  const handleOnPress = () => {
    if (onEdit) {
      progress.value = 1
      Haptics.selectionAsync()
      onEdit()
    }
  }

  return (
    <Pressable onPress={handleOnPress}>
      <Stack space={1}>
        <HStack space={4} justifyContent={"space-between"} px={spacing.micro} {...rest}>
          <Label icon={icon} label={label} />
          <Button.Group size="md" variant="ghost" justifyContent={"flex-end"}>
            {isCopy ? <CopyButton isDisabled={!singleVal} text={singleVal} /> : null}
            {isShare ? <ShareButton isDisabled={!singleVal} text={singleVal} /> : null}
            {isOpen ? <OpenMapButton isDisabled={!singleVal} text={singleVal} /> : null}
          </Button.Group>
        </HStack>

        <AnimateBackground sharedValue={progress}>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Stack space={0} flex={1}>
              <Text flex={1} fontSize="md" text={line1}></Text>
              <Text flex={1} fontSize="md" text={line2}></Text>
            </Stack>
            {onEdit ? (
              <Box>
                <Icon size={16} icon="pencilSquare" />
              </Box>
            ) : null}
          </HStack>
        </AnimateBackground>
      </Stack>
    </Pressable>
  )
}

export interface ILabelValuePillTagsProps extends IStackProps {
  icon?: IconProps["icon"]
  label: TextProps["tx"]
  tags: ITag[]
}

export const ValueTags = ({ label, icon, tags, ...rest }: ILabelValuePillTagsProps) => {
  const progress = useSharedValue(0)

  return (
    <Stack space={1}>
      <HStack space={4} justifyContent={"space-between"} px={spacing.micro} {...rest}>
        <Label icon={icon} label={label} />
      </HStack>

      <AnimateBackground sharedValue={progress}>
        <Stack space={0} flex={1}>
          {tags && tags?.length ? (
            <TagPill.Group tags={tags} />
          ) : (
            <Text flex={1} colorToken="text.softest" fontSize={"md"} tx={"common.noValue"}></Text>
          )}
        </Stack>
      </AnimateBackground>
    </Stack>
  )
}
export interface ILabelValuePillSourceTypeProps extends IStackProps {
  icon?: IconProps["icon"]
  label: TextProps["tx"]
  contactSource: IContact["SourceType"]
}

export const ValueContactSource = ({
  label,
  icon,
  contactSource,
  ...rest
}: ILabelValuePillSourceTypeProps) => {
  const progress = useSharedValue(0)

  return (
    <Stack space={1}>
      <HStack space={4} justifyContent={"space-between"} px={spacing.micro} {...rest}>
        <Label icon={icon} label={label} />
      </HStack>

      <AnimateBackground sharedValue={progress}>
        <Stack space={0} flex={1}>
          {contactSource ? (
            <HStack alignItems={"center"} space={spacing.micro}>
              <ContactSourceAvatar size={"xs"} contactSource={contactSource} />
              <Text
                flex={1}
                fontSize="md"
                text={`Contact is synced with ${runFormatSourceDisplay(contactSource)}`}
              ></Text>
            </HStack>
          ) : (
            <HStack alignItems={"center"} space={spacing.micro}>
              <ContactSourceAvatar size={"xs"} contactSource={contactSource} />
              <Text
                flex={1}
                fontSize="md"
                text={`Contact added manually from CurrentClient`}
              ></Text>
            </HStack>
          )}
        </Stack>
      </AnimateBackground>
    </Stack>
  )
}

export interface ILabelValuePillSourceCrmProps extends IStackProps {
  icon?: IconProps["icon"]
  label: TextProps["tx"]
  sourceCrm: IConnector["ConnectorType"]
}

export const ValueSourceCrm = ({
  label,
  icon,
  sourceCrm,
  ...rest
}: ILabelValuePillSourceCrmProps) => {
  const progress = useSharedValue(0)

  return (
    <Stack space={1}>
      <HStack space={4} justifyContent={"space-between"} px={spacing.micro} {...rest}>
        <Label icon={icon} label={label} />
      </HStack>

      <AnimateBackground sharedValue={progress}>
        <Stack space={0} flex={1}>
          {sourceCrm ? (
            <HStack rounded="lg" py={spacing.tiny} overflow={"hidden"} justifyContent="center">
              <AutoImage
                resizeMode="cover"
                source={{
                  uri: SUPPORTED_CRM_URLS[sourceCrm],
                }}
                maxHeight={48}
              />
            </HStack>
          ) : (
            <Text flex={1} colorToken="text.softest" fontSize={"md"} tx={"common.noValue"}></Text>
          )}
        </Stack>
      </AnimateBackground>
    </Stack>
  )
}
export interface ILabelValuePillBooleanProps extends IStackProps {
  icon?: IconProps["icon"]
  label: TextProps["tx"]
  trueTx?: TextProps["tx"]
  trueText?: TextProps["text"]
  falseTx?: TextProps["tx"]
  falseText?: TextProps["text"]
  value: boolean
  dotProps?: IDotProps
  onEdit?: () => void
}

export const ValueBoolean = ({
  label,
  icon,
  value,
  dotProps,
  onEdit,
  trueTx,
  falseTx,
  trueText,
  falseText,
  ...rest
}: ILabelValuePillBooleanProps) => {
  const progress = useSharedValue(0)

  const handleOnPress = () => {
    if (onEdit) {
      progress.value = 1
      Haptics.selectionAsync()
      onEdit()
    }
  }

  return (
    <Pressable onPress={handleOnPress}>
      <Stack space={1}>
        <HStack space={4} justifyContent={"space-between"} px={spacing.micro} {...rest}>
          <Label icon={icon} label={label} />
        </HStack>

        <AnimateBackground sharedValue={progress}>
          <HStack space={0} flex={1} alignItems={"center"} justifyContent={"space-between"}>
            <HStack alignItems={"center"} space={spacing.tiny}>
              {value ? (
                <>
                  <Dot.Success size="md" {...dotProps} />
                  <Text
                    tx={trueTx ? trueTx : !trueText ? "common.active" : null}
                    text={trueText}
                  ></Text>
                </>
              ) : (
                <>
                  <Dot.Warning size="md" {...dotProps} />
                  <Text
                    tx={falseTx ? falseTx : !falseText ? "common.inActive" : null}
                    text={falseText}
                  ></Text>
                </>
              )}
            </HStack>
            {onEdit ? (
              <Box>
                <Icon size={16} icon="pencilSquare" />
              </Box>
            ) : null}
          </HStack>
        </AnimateBackground>
      </Stack>
    </Pressable>
  )
}
export interface ILabelValuePillHoursProps extends IStackProps {
  icon?: IconProps["icon"]
  label: TextProps["tx"]
  trueTx?: TextProps["tx"]
  trueText?: TextProps["text"]
  falseTx?: TextProps["tx"]
  falseText?: TextProps["text"]
  value: BusinessHourDaySchedule
  dotProps?: IDotProps
  onEdit?: () => void
}

export const ValueHours = ({
  label,
  icon,
  value,
  dotProps,
  onEdit,
  trueTx,
  falseTx,
  trueText,
  falseText,
  ...rest
}: ILabelValuePillHoursProps) => {
  const progress = useSharedValue(0)

  const handleOnPress = () => {
    if (onEdit) {
      progress.value = 1
      Haptics.selectionAsync()
      onEdit()
    }
  }

  const isClosed = !value.start

  return (
    <Pressable onPress={handleOnPress}>
      <Stack space={1}>
        <HStack space={4} justifyContent={"space-between"} px={spacing.micro} {...rest}>
          <Label icon={icon} label={label} />
        </HStack>

        <AnimateBackground sharedValue={progress}>
          <HStack space={0} flex={1} alignItems={"center"} justifyContent={"space-between"}>
            <HStack alignItems={"center"} justifyContent="space-around" space={spacing.tiny}>
              {isClosed ? (
                <>
                  <Dot.Warning {...dotProps} />
                  <Text tx={"common.closed"}></Text>
                </>
              ) : (
                <>
                  <Dot.Success {...dotProps} />
                  <Text text={runFormat24Hrto12Hr(value.start)}></Text>
                  <Text text="-"></Text>
                  <Text text={runFormat24Hrto12Hr(value.end)}></Text>
                </>
              )}
            </HStack>
            {onEdit ? (
              <Box>
                <Icon size={16} icon="pencilSquare" />
              </Box>
            ) : null}
          </HStack>
        </AnimateBackground>
      </Stack>
    </Pressable>
  )
}

export interface ILabelValuePillMessageProps extends IStackProps {
  icon?: IconProps["icon"]
  label: TextProps["tx"]
  messageBody: IBroadcast["MessageBody"]
  messageMediaItems?: IBroadcast["MessageMediaItems"]
  onEdit?: () => void
}

export const ValueMessage = ({
  label,
  icon,
  messageBody,
  messageMediaItems,
  children,
  onEdit,
  ...rest
}: ILabelValuePillMessageProps) => {
  const progress = useSharedValue(0)

  const handleOnPress = () => {
    if (onEdit) {
      progress.value = 1
      Haptics.selectionAsync()
      onEdit()
    }
  }

  return (
    <Pressable onPress={handleOnPress}>
      <Stack space={1}>
        <HStack
          space={4}
          alignItems={"center"}
          justifyContent={"space-between"}
          px={spacing.micro}
          {...rest}
        >
          <Label icon={icon} label={label} />
        </HStack>
        <AnimateBackground sharedValue={progress}>
          <Stack space={spacing.tiny}>
            {messageMediaItems ? (
              <MessageMediaItemsPreview
                isUserMessage={false}
                mediaItems={messageMediaItems}
              ></MessageMediaItemsPreview>
            ) : null}

            <HStack alignItems={"center"} justifyContent={"space-between"}>
              {messageBody ? (
                <>
                  <Text flex={1} fontSize="md" text={messageBody}></Text>
                </>
              ) : (
                <Text
                  flex={1}
                  colorToken="text.softest"
                  fontSize={"md"}
                  tx={"common.noValue"}
                ></Text>
              )}

              {onEdit ? (
                <Box>
                  <Icon size={16} icon="pencilSquare" />
                </Box>
              ) : null}
            </HStack>
          </Stack>
        </AnimateBackground>
      </Stack>
    </Pressable>
  )
}

export const LabelValuePill = {
  Text: ValueText,
  PhoneType: ValuePhoneType,
  Address: ValueAddress,
  Tags: ValueTags,
  ContactSource: ValueContactSource,
  SourceCrm: ValueSourceCrm,
  Boolean: ValueBoolean,
  Hours: ValueHours,
  Message: ValueMessage,
}
