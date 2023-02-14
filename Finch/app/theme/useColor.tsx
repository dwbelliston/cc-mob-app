import { useColorMode } from "native-base"

interface IColorToken {
  light: string
  dark: string
}

const COLOR_TOKENS: { [token: string]: IColorToken } = {
  // Backgrounds
  "bg.main": {
    light: "white",
    dark: "gray.900",
  },
  "bg.high": {
    light: "gray.50",
    dark: "gray.800",
  },
  "bg.higher": {
    light: "gray.100",
    dark: "gray.700",
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
