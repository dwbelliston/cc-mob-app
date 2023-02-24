/**
 * Wraps NB button providing the translate options
 */

import { IconButton as NBIconButton, IIconButtonProps as NBIIconButtonProps } from "native-base"
import React from "react"
import { translate } from "../i18n"
import { TextProps } from "./Text"

export interface IconButtonProps extends NBIIconButtonProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"]
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"]
}

export const IconButton = (props: IconButtonProps) => {
  const { tx, text, txOptions, ...rest } = props

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text

  return <NBIconButton accessibilityLabel={i18nText} {...rest}></NBIconButton>
}
