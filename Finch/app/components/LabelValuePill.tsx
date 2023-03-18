import * as Haptics from "expo-haptics"
import { Box, Button, HStack, IStackProps, Pressable, Stack } from "native-base"
import React from "react"
import { IConnector, SUPPORTED_CRM_URLS } from "../models/Connector"
import { IContact, runFormatSourceDisplay } from "../models/Contact"
import { ITag } from "../models/Tag"
import { spacing } from "../theme"
import { useColor } from "../theme/useColor"
import { AutoImage } from "./AutoImage"
import { ContactSourceAvatar } from "./ContactSourceAvatar"
import { CopyButton } from "./CopyButton"
import { Dot, IDotProps } from "./Dot"
import { Icon, IconProps } from "./Icon"
import { OpenMapButton } from "./OpenMapButton"
import { ShareButton } from "./ShareButton"
import { TagPill } from "./TagPill"
import { Text, TextProps } from "./Text"

export interface ILabelProps extends IStackProps {
  icon: IconProps["icon"]
  label: TextProps["tx"]
}

const PILL_STYLES = {
  rounded: "lg",
  py: spacing.tiny,
  px: spacing.tiny,
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
  const bgPill = useColor("bg.high")

  const handleOnPress = () => {
    if (onEdit) {
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
        <HStack bg={bgPill} {...PILL_STYLES} alignItems={"center"} justifyContent={"space-between"}>
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
  const bgPill = useColor("bg.high")

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

        <HStack bg={bgPill} {...PILL_STYLES} alignItems={"center"} justifyContent={"space-between"}>
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
  const bgPill = useColor("bg.high")

  return (
    <Stack space={1}>
      <HStack space={4} justifyContent={"space-between"} px={spacing.micro} {...rest}>
        <Label icon={icon} label={label} />
      </HStack>

      <Stack space={0} flex={1} bg={bgPill} {...PILL_STYLES}>
        {tags && tags?.length ? (
          <TagPill.Group tags={tags} />
        ) : (
          <Text flex={1} colorToken="text.softest" fontSize={"md"} tx={"common.noValue"}></Text>
        )}
      </Stack>
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
  const bgPill = useColor("bg.high")

  return (
    <Stack space={1}>
      <HStack space={4} justifyContent={"space-between"} px={spacing.micro} {...rest}>
        <Label icon={icon} label={label} />
      </HStack>

      <Stack space={0} flex={1} bg={bgPill} {...PILL_STYLES}>
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
            <Text flex={1} fontSize="md" text={`Contact added manually from CurrentClient`}></Text>
          </HStack>
        )}
      </Stack>
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
  const bgPill = useColor("bg.high")

  return (
    <Stack space={1}>
      <HStack space={4} justifyContent={"space-between"} px={spacing.micro} {...rest}>
        <Label icon={icon} label={label} />
      </HStack>

      <Stack space={0} flex={1} bg={bgPill} {...PILL_STYLES}>
        {sourceCrm ? (
          <HStack
            bg="white"
            rounded="lg"
            py={spacing.tiny}
            overflow={"hidden"}
            justifyContent="center"
          >
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
  const bgPill = useColor("bg.high")

  const handleOnPress = () => {
    if (onEdit) {
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

        <HStack
          space={0}
          flex={1}
          bg={bgPill}
          {...PILL_STYLES}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <HStack alignItems={"center"} space={spacing.tiny}>
            {value ? (
              <>
                <Dot.Success {...dotProps} />
                <Text tx={trueTx ? trueTx : "common.active"} text={trueText}></Text>
              </>
            ) : (
              <>
                <Dot.Warning {...dotProps} />
                <Text tx={falseTx ? falseTx : "common.inActive"} text={falseText}></Text>
              </>
            )}
          </HStack>
          {onEdit ? (
            <Box>
              <Icon size={16} icon="pencilSquare" />
            </Box>
          ) : null}
        </HStack>
      </Stack>
    </Pressable>
  )
}

export const LabelValuePill = {
  Text: ValueText,
  Address: ValueAddress,
  Tags: ValueTags,
  ContactSource: ValueContactSource,
  SourceCrm: ValueSourceCrm,
  Boolean: ValueBoolean,
}
