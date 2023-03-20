import { Picker } from "@react-native-picker/picker"
import { Box, FormControl as NBFormControl, Stack } from "native-base"
import React, { forwardRef, Ref, useImperativeHandle, useRef } from "react"
import { Controller } from "react-hook-form"
import { spacing } from "../theme"
import { useColor } from "../theme/useColor"
import { Text, TextProps } from "./Text"

export interface IPickerOption {
  label: string
  value: string
}
export interface FormPickerProps {
  /**
   * Name of the form field
   */
  name: string
  errors?: any
  options: IPickerOption[]
  /**
   * Form controller from form hook
   */
  control: any
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps["text"]
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: TextProps["tx"]
  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: TextProps["txOptions"]
  /**
   * The helper text to display
   */
  helperTextProps?: TextProps
}

export const FormPicker = forwardRef(function CheckboxField(props: FormPickerProps, ref: Ref<any>) {
  let {
    name,
    control,
    options = [],
    errors,
    labelTx,
    label,
    labelTxOptions,
    helperTextProps,
    ...SwitchProps
  } = props

  const input = useRef<any>()

  const pickerBg = useColor("bg.high")
  const pickerBorder = useColor("text.softest")

  function focusInput() {
    input.current?.focus()
  }

  useImperativeHandle(ref, () => input.current)

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({
        field: { ref, value, ...field },
        fieldState: { error: fieldError, isDirty, isTouched },
      }) => {
        return (
          <NBFormControl isInvalid={!!fieldError} isRequired={control.isRequired}>
            <Stack alignItems="center" space={spacing.tiny}>
              {!!(label || labelTx) && (
                <Text
                  text={label}
                  tx={labelTx}
                  // fontFamily="mono"
                  fontSize="md"
                  colorToken="text.soft"
                  txOptions={labelTxOptions}
                  // isFormLabel={true}
                />
              )}

              <Box
                flex={1}
                w="full"
                bg={pickerBg}
                rounded="lg"
                borderWidth={1}
                borderColor={pickerBorder}
              >
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue, itemIndex) => field.onChange(itemValue)}
                >
                  {options.map((option) => {
                    return (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    )
                  })}
                </Picker>
              </Box>
            </Stack>

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
  )
})
