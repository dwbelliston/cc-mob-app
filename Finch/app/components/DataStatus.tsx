import { Box, Circle, Stack } from "native-base"
import { ColorType } from "native-base/lib/typescript/components/types"
import React from "react"
import { spacing } from "../theme"
import { useColor } from "../theme/useColor"
import { Icon, IconTypes } from "./Icon"
import { Text } from "./Text"

export interface IDataStatusProps {
  title: string
  description?: string
  icon: IconTypes
  colorScheme: ColorType
  children?: React.ReactNode
}

interface StatusConfig {
  icon: IconTypes
  colorSchema: ColorType
}

export const DataStatus = ({
  title,
  description,
  icon,
  colorScheme: c,
  children,
}: IDataStatusProps) => {
  const bgBorder = useColor("bg.higher")

  return (
    <Box
      w="full"
      h="full"
      px={spacing.tiny}
      py={spacing.small}
      _light={{
        borderColor: bgBorder,
      }}
      _dark={{
        borderColor: bgBorder,
      }}
    >
      <Stack space={4} w="full" alignItems={"center"}>
        {/* Icon */}
        <Circle
          shadow={1}
          p={3}
          borderWidth={2}
          rounded="lg"
          _light={{
            bg: `${c}.600`,
            borderColor: `${c}.300`,
          }}
          _dark={{
            bg: `${c}.600`,
            borderColor: `${c}.700`,
          }}
        >
          <Icon
            _light={{
              color: `${c}.50`,
            }}
            _dark={{
              color: `${c}.100`,
            }}
            icon={icon}
          ></Icon>
        </Circle>
        <Stack space={spacing.tiny} flex={1}>
          <Text
            _light={{
              color: `${c}.800`,
            }}
            textAlign="center"
            _dark={{
              color: `${c}.100`,
            }}
            text={title}
            fontSize="lg"
            fontWeight={"semibold"}
          ></Text>
          {description && (
            <Text textAlign="center" colorToken="text.softer" text={description}></Text>
          )}
        </Stack>
        {children && <Box>{children}</Box>}
      </Stack>
    </Box>
  )
}
