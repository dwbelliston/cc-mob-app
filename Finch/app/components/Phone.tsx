import { Badge, HStack, Stack } from "native-base"

import React from "react"
import { NumberCarrierTypeEnum } from "../models/Contact"
import { spacing } from "../theme"
import { runFormatPhone } from "../utils/useFormatPhone"
import { Dot, DotStatuses } from "./Dot"
import { Icon } from "./Icon"
import { Text, TextProps } from "./Text"

interface ITypeDescriptionProps extends TextProps {
  numberCarrierType?: NumberCarrierTypeEnum
}

interface IProps {
  phone: string | null
  numberCarrierType?: NumberCarrierTypeEnum
  numberCarrierName?: string
}

const TYPE_TXPATH: { [key: string]: TextProps["tx"] } = {
  landline: "phone.landline",
  voip: "phone.voip",
  mobile: "phone.mobile",
  error: "phone.invalid",
  unknown: "phone.unknown",
  invalid: "phone.invalid",
}

const TYPE_STATUS: { [key: string]: DotStatuses } = {
  landline: "warning",
  voip: "success",
  mobile: "success",
  error: "error",
  invalid: "error",
  unknown: "neutral",
}

const PhonePill = ({ phone, numberCarrierType, numberCarrierName }: IProps) => {
  let badgeScheme = "gray"

  const badgeColorSchemeLookup = {
    landline: "orange",
    voip: "green",
    mobile: "green",
    error: "red",
    invalid: "red",
  }

  if (phone) {
    phone = runFormatPhone(phone)
  }

  if (numberCarrierType) {
    badgeScheme = badgeColorSchemeLookup[numberCarrierType]
  }

  return (
    <Stack space="2">
      <Badge rounded="md" colorScheme={badgeScheme} py={0.5} px={2} variant="subtle">
        <HStack>
          {numberCarrierType && numberCarrierType === NumberCarrierTypeEnum.ERROR && (
            <Icon size={20} icon={"noSymbol"}></Icon>
          )}
          {numberCarrierType && numberCarrierType === NumberCarrierTypeEnum.INVALID && (
            <Icon size={20} icon={"noSymbol"}></Icon>
          )}
          {numberCarrierType && numberCarrierType === NumberCarrierTypeEnum.MOBILE && (
            <Icon size={20} icon="checkCircle"></Icon>
          )}
          {numberCarrierType && numberCarrierType === NumberCarrierTypeEnum.LANDLINE && (
            <Icon size={20} icon="informationCircle"></Icon>
          )}
          {numberCarrierType && numberCarrierType === NumberCarrierTypeEnum.VOIP && (
            <Icon size={20} icon="checkCircle"></Icon>
          )}

          <Text color="gray.600">{phone}</Text>
        </HStack>
      </Badge>

      {numberCarrierName && (
        <Text fontSize="sm" color="gray.500" maxW={48} isTruncated={true}>
          {numberCarrierName}
        </Text>
      )}
    </Stack>
  )
}

export const TypeDescription = ({ numberCarrierType, ...rest }: ITypeDescriptionProps) => {
  let txPath: TextProps["tx"] = TYPE_TXPATH["unknown"]
  let dotStatus: DotStatuses = TYPE_STATUS["unknown"]

  if (numberCarrierType) {
    txPath = TYPE_TXPATH[numberCarrierType]
    dotStatus = TYPE_STATUS[numberCarrierType]
  }

  return (
    <HStack space={spacing.micro} alignItems="center">
      <Dot.Base status={dotStatus} size="sm" />
      <Text {...rest} tx={txPath} />
    </HStack>
  )
}

export const PhoneDot = ({ numberCarrierType, ...rest }: ITypeDescriptionProps) => {
  let dotStatus: DotStatuses = TYPE_STATUS["unknown"]

  if (numberCarrierType) {
    dotStatus = TYPE_STATUS[numberCarrierType]
  }

  return <Dot.Base status={dotStatus} size="sm" />
}

export const Phone = {
  Pill: PhonePill,
  Dot: PhoneDot,
  Type: TypeDescription,
}
