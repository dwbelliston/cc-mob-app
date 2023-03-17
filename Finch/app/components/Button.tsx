/**
 * Wraps NB button providing the translate options
 */

import { Button as NBButton, IButtonProps as NBIButtonProps } from "native-base"
import React from "react"
import { translate } from "../i18n"
import { TextProps } from "./Text"

export interface ButtonProps extends NBIButtonProps {
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

export const Button = (props: ButtonProps) => {
  const { tx, text, txOptions, children, ...rest } = props

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  return <NBButton {...rest}>{content}</NBButton>
}

export const ButtonGroup = NBButton.Group
