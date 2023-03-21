/**
 * Wraps native base text to allow for translate
 */
import i18n from "i18n-js"
import { ITextProps as NBITextProps, Text as NBText } from "native-base"
import { ColorType } from "native-base/lib/typescript/components/types"
import React from "react"
import { translate, TxKeyPath } from "../i18n"
import { ColorTokenOption, useColor } from "../theme/useColor"

type Presets = keyof typeof $presets

export interface TextProps extends NBITextProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: i18n.TranslateOptions
  /**
   * Color token to use
   */
  colorToken?: ColorTokenOption
  /**
   * One of the different types of text presets.
   */
  preset?: Presets
}

export const Text = (props: TextProps) => {
  const { size, tx, txOptions, text, color, colorToken = "text", children, ...rest } = props

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const presetStyles =
    rest.preset && $presets[rest.preset] ? $presets[rest.preset] : $presets["default"]

  let _color = useColor(colorToken) as ColorType

  if (color) {
    _color = color
  }

  return (
    <NBText adjustsFontSizeToFit={true} color={_color} {...presetStyles} {...rest}>
      {content}
    </NBText>
  )
}

const $baseStyle = {
  fontSize: "sm",
  fontWeight: "normal",
}

const $presets = {
  default: $baseStyle,
  heading: {
    fontSize: "3xl",
    fontWeight: "bold",
    maxFontSizeMultiplier: 1,
  },
  subheading: {
    fontSize: "lg",
    fontWeight: "semibold",
  },
  legal: {
    fontSize: "xs",
    fontWeight: "normal",
  },
  label: {
    fontSize: "sm",
    fontWeight: "normal",
  },
}
