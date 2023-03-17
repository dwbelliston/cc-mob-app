import { useBottomSheetInternal } from "@gorhom/bottom-sheet"
import {
  FormControl as NBFormControl,
  IconButton,
  IInputProps,
  Input,
  Pressable,
} from "native-base"
import React, { forwardRef, Ref, useImperativeHandle, useRef } from "react"
import { Controller } from "react-hook-form"

import { translate } from "../i18n"
import { Icon } from "./Icon"
import { Text, TextProps } from "./Text"

export interface FormControlProps extends Omit<IInputProps, "ref"> {
  /**
   * Name of the form field
   */
  name: string
  errors?: any
  /**
   * Name of the form field
   */
  type?: "text" | "password"
  /**
   * Form controller from form hook
   */
  control: any
  /**
   * Number of inputs for code input
   */
  codeCount?: number
  /**
   * The label text to display
   */
  labelProps?: TextProps
  /**
   * The helper text to display
   */
  helperTextProps?: TextProps
  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: TextProps["text"]
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: TextProps["tx"]
  /**
   * Optional placeholder options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  placeholderTxOptions?: TextProps["txOptions"]
  /**
   * Optional value to toggle secure entry value
   */
  defaultSecureEntry?: boolean
}

export const FormControl = forwardRef(function FormControl(props: FormControlProps, ref: Ref<any>) {
  let {
    name,
    type = "text",
    control,
    errors,
    labelProps,
    placeholderTx,
    placeholder,
    placeholderTxOptions,
    helperTextProps,
    InputLeftElement,
    InputRightElement,
    codeCount,
    defaultSecureEntry,
    ...TextInputProps
  } = props

  const [isSecureEntry, setIsSecureEntry] = React.useState(defaultSecureEntry)

  const input = useRef<any>()

  const isDisabled = TextInputProps.isDisabled

  const placeholderContent = placeholderTx
    ? translate(placeholderTx, placeholderTxOptions)
    : placeholder

  function focusInput() {
    if (isDisabled) return

    input.current?.focus()
  }

  const togglePassword = () => setIsSecureEntry(!isSecureEntry)

  useImperativeHandle(ref, () => input.current)

  return (
    <Pressable onPress={focusInput} accessibilityState={{ disabled: isDisabled }}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error: fieldError, isDirty, isTouched },
        }) => {
          return (
            <NBFormControl
              isDisabled={isDisabled}
              isInvalid={!!fieldError}
              isRequired={control.isRequired}
            >
              {!!(labelProps?.text || labelProps?.tx) && (
                <Text
                  // isFormLabel={true}
                  {...labelProps}
                />
              )}

              <Input
                // invalid={!!fieldError}
                // isDirty={isDirty}
                // isTouched={isTouched}
                onBlur={onBlur}
                editable={!isDisabled}
                // type={isSecureEntry ? type : "text"}
                secureTextEntry={isSecureEntry}
                placeholder={placeholderContent || undefined}
                onChangeText={(val) => onChange(val)}
                value={value}
                InputLeftElement={InputLeftElement}
                InputRightElement={
                  type === "password" ? (
                    <IconButton
                      variant={"ghost"}
                      onPress={togglePassword}
                      icon={
                        <Icon
                          colorToken={"text.softer"}
                          icon={isSecureEntry ? "eye" : "eyeSlash"}
                        />
                      }
                    />
                  ) : (
                    InputRightElement
                  )
                }
                {...TextInputProps}
              />

              <NBFormControl.ErrorMessage>{fieldError?.message}</NBFormControl.ErrorMessage>

              {!!(helperTextProps?.text || helperTextProps?.tx) && (
                <NBFormControl.HelperText>
                  <Text fontSize="md" colorToken="text.softer" {...helperTextProps} />
                </NBFormControl.HelperText>
              )}
            </NBFormControl>
          )
        }}
      />
    </Pressable>
  )
})

// Used inside bottom sheet
export const BottomSheetFormControl = forwardRef(function FormControl(
  props: FormControlProps,
  ref: Ref<any>,
) {
  let {
    name,
    type = "text",
    control,
    errors,
    labelProps,
    placeholderTx,
    placeholder,
    placeholderTxOptions,
    helperTextProps,
    InputLeftElement,
    InputRightElement,
    codeCount,
    defaultSecureEntry,
    ...TextInputProps
  } = props

  const [isSecureEntry, setIsSecureEntry] = React.useState(defaultSecureEntry)

  const input = useRef<any>()

  const isDisabled = TextInputProps.isDisabled

  const placeholderContent = placeholderTx
    ? translate(placeholderTx, placeholderTxOptions)
    : placeholder

  function focusInput() {
    if (isDisabled) return

    input.current?.focus()
  }

  const togglePassword = () => setIsSecureEntry(!isSecureEntry)

  useImperativeHandle(ref, () => input.current)

  return (
    <Pressable onPress={focusInput} accessibilityState={{ disabled: isDisabled }}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error: fieldError, isDirty, isTouched },
        }) => {
          // SPECIAL BOTTOM SHEET
          const { shouldHandleKeyboardEvents } = useBottomSheetInternal()

          const handleOnFocus = React.useCallback(
            (args) => {
              shouldHandleKeyboardEvents.value = true
              if (TextInputProps?.onFocus) {
                TextInputProps.onFocus(args)
              }
            },
            [TextInputProps?.onFocus, shouldHandleKeyboardEvents],
          )

          const handleOnBlur = React.useCallback(
            (args) => {
              shouldHandleKeyboardEvents.value = false
              if (onBlur) {
                onBlur()
                if (TextInputProps?.onBlur) {
                  TextInputProps.onBlur(args)
                }
              }
            },
            [onBlur, shouldHandleKeyboardEvents],
          )

          // SPECIAL BOTTOM SHEET

          return (
            <NBFormControl
              isDisabled={isDisabled}
              isInvalid={!!fieldError}
              isRequired={control.isRequired}
            >
              {!!(labelProps?.text || labelProps?.tx) && (
                <Text
                  // isFormLabel={true}
                  {...labelProps}
                />
              )}

              <Input
                // invalid={!!fieldError}
                // isDirty={isDirty}
                // isTouched={isTouched}
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
                editable={!isDisabled}
                // type={isSecureEntry ? type : "text"}
                secureTextEntry={isSecureEntry}
                placeholder={placeholderContent || undefined}
                onChangeText={(val) => onChange(val)}
                value={value}
                InputLeftElement={InputLeftElement}
                InputRightElement={
                  type === "password" ? (
                    <IconButton
                      variant={"ghost"}
                      onPress={togglePassword}
                      icon={
                        <Icon
                          colorToken={"text.softer"}
                          icon={isSecureEntry ? "eye" : "eyeSlash"}
                        />
                      }
                    />
                  ) : (
                    InputRightElement
                  )
                }
                {...TextInputProps}
              />

              <NBFormControl.ErrorMessage>{fieldError?.message}</NBFormControl.ErrorMessage>

              {!!(helperTextProps?.text || helperTextProps?.tx) && (
                <NBFormControl.HelperText>
                  <Text fontSize="md" colorToken="text.softer" {...helperTextProps} />
                </NBFormControl.HelperText>
              )}
            </NBFormControl>
          )
        }}
      />
    </Pressable>
  )
})
