import { Button, HStack, IStackProps, Stack } from "native-base"
import React from "react"
import { IContact, runFormatSourceDisplay } from "../models/Contact"
import { ITag } from "../models/Tag"
import { spacing } from "../theme"
import { useColor } from "../theme/useColor"
import { ContactSourceAvatar } from "./ContactSourceAvatar"
import { CopyButton } from "./CopyButton"
import { Icon, IconProps } from "./Icon"
import { OpenMapButton } from "./OpenMapButton"
import { ShareButton } from "./ShareButton"
import { TagPill } from "./TagPill"
import { Text, TextProps } from "./Text"

export interface ILabelProps extends IStackProps {
  icon: IconProps["icon"]
  label: TextProps["tx"]
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
}

export const ValueText = ({
  label,
  icon,
  text,
  children,
  isCopy = true,
  isShare = true,
  ...rest
}: ILabelValuePillTextProps) => {
  const bgPill = useColor("bg.high")

  return (
    <Stack
      space={1}
      bg={bgPill}
      rounded="lg"
      pt={spacing.micro}
      pb={spacing.tiny}
      px={spacing.tiny}
    >
      <HStack space={4} alignItems={"center"} justifyContent={"space-between"} {...rest}>
        <Label icon={icon} label={label} />
        {text ? (
          <Button.Group size="md" variant="ghost" justifyContent={"flex-end"}>
            {isCopy ? <CopyButton text={text} /> : null}
            {isShare ? <ShareButton text={text} /> : null}
          </Button.Group>
        ) : null}
      </HStack>
      {text ? (
        <>
          <Text flex={1} fontSize="md" text={text}></Text>
        </>
      ) : (
        <Text flex={1} colorToken="text.softest" fontSize={"md"} tx={"common.noValue"}></Text>
      )}
    </Stack>
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

  return (
    <Stack
      space={3}
      bg={bgPill}
      rounded="lg"
      pt={spacing.micro}
      pb={spacing.tiny}
      px={spacing.tiny}
    >
      <HStack space={4} alignItems={"flex-end"} justifyContent={"space-between"} {...rest}>
        <Label icon={icon} label={label} />
        <Button.Group size="md" variant="ghost" justifyContent={"flex-end"}>
          <CopyButton isDisabled={!singleVal} text={singleVal} />
          <ShareButton isDisabled={!singleVal} text={singleVal} />
          <OpenMapButton isDisabled={!singleVal} text={singleVal} />
        </Button.Group>
      </HStack>

      <Stack space={0} flex={1}>
        <Text flex={1} fontSize="md" text={line1}></Text>
        <Text flex={1} fontSize="md" text={line2}></Text>
      </Stack>
    </Stack>
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
    <Stack
      space={3}
      bg={bgPill}
      rounded="lg"
      pt={spacing.micro}
      pb={spacing.tiny}
      px={spacing.tiny}
    >
      <HStack space={4} alignItems={"flex-end"} justifyContent={"space-between"} {...rest}>
        <Label icon={icon} label={label} />
      </HStack>

      <Stack space={0} flex={1}>
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
    <Stack
      space={3}
      bg={bgPill}
      rounded="lg"
      pt={spacing.micro}
      pb={spacing.tiny}
      px={spacing.tiny}
    >
      <HStack space={4} alignItems={"flex-end"} justifyContent={"space-between"} {...rest}>
        <Label icon={icon} label={label} />
      </HStack>

      <Stack space={0} flex={1}>
        {contactSource ? (
          <HStack alignItems={"center"} space={spacing.micro}>
            <ContactSourceAvatar size={"xs"} contactSource={contactSource} />
            <Text
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

export const LabelValuePill = {
  Text: ValueText,
  Address: ValueAddress,
  Tags: ValueTags,
  ContactSource: ValueContactSource,
}
