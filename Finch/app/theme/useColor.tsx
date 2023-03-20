import { useColorMode } from "native-base"
import { colors } from "./colors"

interface IColorToken {
  light: string
  dark: string
}

const COLOR_TOKENS: { [token: string]: IColorToken } = {
  // Backgrounds
  "bg.main": {
    light: "white",
    dark: colors.gray[900],
  },
  "bg.high": {
    light: colors.gray[50],
    dark: colors.gray[800],
  },
  "bg.higher": {
    light: colors.gray[100],
    dark: colors.gray[700],
  },
  "bg.header": {
    light: "white",
    dark: colors.gray[800],
  },
  "bg.largeHeader": {
    light: "white",
    dark: colors.gray[900],
  },
  "bg.accent": {
    light: colors.primary[700],
    dark: colors.gray[900],
  },
  // Text
  text: {
    light: colors.gray[800],
    dark: "white",
  },
  "text.primary": {
    light: "primary.500",
    dark: "primary.200",
  },
  "text.secondary": {
    light: "secondary.500",
    dark: "secondary.200",
  },
  "text.contrast": {
    light: "gray.100",
    dark: "gray.800",
  },
  "text.light": {
    light: "white",
    dark: "white",
  },
  "text.lighter": {
    light: "gray.300",
    dark: "gray.300",
  },
  "text.soft": {
    light: colors.gray[600],
    dark: colors.gray[300],
  },
  "text.softer": {
    light: "gray.400",
    dark: "gray.500",
  },
  "text.softest": {
    light: colors.gray[200],
    dark: colors.gray[700],
  },
  error: {
    light: "error.600",
    dark: "error.300",
  },
  warning: {
    light: "warning.600",
    dark: "warning.300",
  },
  success: {
    light: "success.600",
    dark: "success.300",
  },
  info: {
    light: "info.600",
    dark: "info.300",
  },
} as const // as const is important.

type ColorTokensMap = typeof COLOR_TOKENS
export type ColorTokenOption = keyof ColorTokensMap

export const useColor = (token: ColorTokenOption): string | undefined => {
  let color = undefined

  const { colorMode } = useColorMode()

  const tokenValues = COLOR_TOKENS[token]

  if (colorMode && tokenValues) {
    color = tokenValues[colorMode]
  }
  return color
}
