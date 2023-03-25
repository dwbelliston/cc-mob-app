import { HStack } from "native-base"

import React from "react"
import { Text, TextProps } from "../../components"
import { Dot, DotStatuses } from "../../components/Dot"
import { BroadcastStatusEnum } from "../../models/Broadcast"
import { spacing } from "../../theme"

interface IProps extends TextProps {
  status: BroadcastStatusEnum
}

const TYPE_TXPATH: { [key: string]: TextProps["tx"] } = {
  DRAFT: "broadcasts.draft",
  ACTIVE: "broadcasts.active",
  COMPLETED: "broadcasts.completed",
  ARCHIVED: "broadcasts.archived",
}

const TYPE_STATUS: { [key: string]: DotStatuses } = {
  DRAFT: "info",
  ACTIVE: "success",
  COMPLETED: "neutral",
  ARCHIVED: "error",
}

export const TypeDescription = ({ status, ...rest }: IProps) => {
  let txPath = TYPE_TXPATH[status]
  let dotStatus = TYPE_STATUS[status]

  return (
    <HStack space={spacing.micro} alignItems="center">
      <Dot.Base status={dotStatus} size="sm" />
      <Text {...rest} tx={txPath} />
    </HStack>
  )
}

export const BroadcastStatusDot = ({ status }: IProps) => {
  let dotStatus = TYPE_STATUS[status]

  return <Dot.Base status={dotStatus} size="sm" />
}

export const BroadcastStatus = {
  Dot: BroadcastStatusDot,
  Type: TypeDescription,
}
