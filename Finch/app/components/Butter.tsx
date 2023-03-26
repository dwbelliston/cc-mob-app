import { Box, Circle, HStack, Stack } from "native-base"
import { ColorSchemeType } from "native-base/lib/typescript/components/types"
import React from "react"
import { Icon, IconProps, IconTypes } from "./Icon"
import { Text, TextProps } from "./Text"

export interface IButterProps {
  title?: string
  titleText?: TextProps
  description?: string
  descriptionText?: TextProps
  children?: React.ReactNode
}

export interface IButterIcon {
  colorScheme: ColorSchemeType
  icon: IconProps
}

export const ButterIcon = ({ colorScheme, icon }: IButterIcon) => {
  return (
    <Circle
      shadow={1}
      p={1}
      borderWidth={2}
      rounded="lg"
      _light={{
        bg: `${colorScheme}.600`,
        borderColor: `${colorScheme}.300`,
      }}
      _dark={{
        bg: `${colorScheme}.600`,
        borderColor: `${colorScheme}.700`,
      }}
    >
      <Icon
        _light={{
          color: `${colorScheme}.50`,
        }}
        _dark={{
          color: `${colorScheme}.100`,
        }}
        {...icon}
      ></Icon>
    </Circle>
  )
}
const ButterError = (props: IButterProps) => {
  const { title = "Error", ...rest } = props
  return (
    <ButterBase
      titleText={{ text: title, ...rest.titleText }}
      descriptionText={{ text: rest.description, ...rest.descriptionText }}
      status="error"
      {...rest}
    ></ButterBase>
  )
}

const ButterSuccess = (props: IButterProps) => {
  const { title = "Success", ...rest } = props
  return (
    <ButterBase
      titleText={{ text: title, ...rest.titleText }}
      descriptionText={{ text: rest.description, ...rest.descriptionText }}
      status="success"
      {...rest}
    ></ButterBase>
  )
}

const ButterInfo = (props: IButterProps) => {
  const { title = "Notice", ...rest } = props
  return (
    <ButterBase
      titleText={{ text: title, ...rest.titleText }}
      descriptionText={{ text: rest.description, ...rest.descriptionText }}
      status="info"
      {...rest}
    ></ButterBase>
  )
}

const ButterWarning = (props: IButterProps) => {
  const { title = "Notice", ...rest } = props
  return (
    <ButterBase
      titleText={{ text: title, ...rest.titleText }}
      descriptionText={{ text: rest.description, ...rest.descriptionText }}
      status="warning"
      {...rest}
    ></ButterBase>
  )
}

export type ButterStatuses = "info" | "success" | "error" | "warning"

export interface IButterBaseProps extends IButterProps {
  titleText?: TextProps
  descriptionText?: TextProps
  status?: ButterStatuses
  children?: React.ReactNode
}

interface StatusConfig {
  icon: IconTypes
}

const STATUSES: Record<ButterStatuses, StatusConfig> = {
  info: { icon: "informationCircle" },
  success: { icon: "check" },
  error: { icon: "fire" },
  warning: { icon: "exclamation-triangle" },
}

function getStatusIcon(status: ButterStatuses) {
  return STATUSES[status].icon
}

const ButterBase = ({
  titleText,
  descriptionText,
  status,
  description,
  children,
}: IButterBaseProps) => {
  const statusIconName = getStatusIcon(status)

  return (
    <Box
      w="full"
      variant="solid"
      borderWidth={1}
      rounded="lg"
      px={4}
      py={3}
      _light={{
        bg: `${status}.50`,
        borderColor: `${status}.500`,
      }}
      _dark={{
        bg: `${status}.900`,
        borderColor: `${status}.600`,
      }}
    >
      <HStack space={4} w="full" alignItems={"center"}>
        {/* Icon */}
        <Circle
          shadow={1}
          p={1}
          borderWidth={2}
          rounded="lg"
          _light={{
            bg: `${status}.600`,
            borderColor: `${status}.300`,
          }}
          _dark={{
            bg: `${status}.600`,
            borderColor: `${status}.700`,
          }}
        >
          <Icon
            _light={{
              color: `${status}.50`,
            }}
            _dark={{
              color: `${status}.100`,
            }}
            icon={statusIconName}
          ></Icon>
        </Circle>
        <Stack space={0} flex={1}>
          <Text
            _light={{
              color: `${status}.700`,
            }}
            _dark={{
              color: `${status}.200`,
            }}
            fontWeight={"semibold"}
            {...titleText}
          ></Text>
          {descriptionText && <Text colorToken="text" {...descriptionText}></Text>}
        </Stack>
        {children && <Box>{children}</Box>}
      </HStack>
    </Box>
  )
}

export const Butter = {
  Icon: ButterIcon,
  Base: ButterBase,
  Success: ButterSuccess,
  Info: ButterInfo,
  Error: ButterError,
  Warning: ButterWarning,
}
