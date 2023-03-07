import { colors } from "./colors"
import {
  Badge,
  Button,
  FormControlErrorMessage, IconButton, Input,
  Menu, MenuGroup,
  MenuItem
} from "./nb-components"
import { typography } from "./typography"

export const finchTheme = {
  config: {
    useSystemColorMode: true,
    initialColorMode: "dark",
  },
  components: {
    Button,
    Badge,
    Input,
    FormControlErrorMessage,
    Menu,
    MenuItem,IconButton,
    MenuGroup,
  },
  colors,
  fontConfig: {
    body: typography.Cereal,
    mono: typography.SourecCodePro,
    heading: typography.Cereal,
    plain: typography.Inter,
  },
  fonts: {
    heading: "heading",
    body: "body",
    mono: "mono",
    plain: "plain",
  },
  shadows: {
    "1": {
      "box-shadow": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    },
    "2": {
      "box-shadow": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
    "3": {
      "box-shadow": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
  },
}

type INativeBaseTheme = typeof finchTheme

declare module "native-base" {
  interface ICustomTheme extends INativeBaseTheme {}
}
