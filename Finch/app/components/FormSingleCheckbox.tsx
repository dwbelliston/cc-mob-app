import { Checkbox, FormControl as NBFormControl, ICheckboxProps, Pressable } from "native-base"
import React, { forwardRef, Ref, useImperativeHandle, useRef } from "react"
import { Controller } from "react-hook-form"
import { Text, TextProps } from "./Text"

export interface FormSingleCheckboxProps extends Omit<ICheckboxProps, "ref" | "value"> {
  /**
   * Name of the form field
   */
  name: string
  errors?: any
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

export const FormSingleCheckbox = forwardRef(function CheckboxField(
  props: FormSingleCheckboxProps,
  ref: Ref<any>,
) {
  let {
    name,
    control,
    errors,
    labelTx,
    label,
    labelTxOptions,
    helperTextProps,
    ...CheckboxInputProps
  } = props

  const input = useRef<any>()

  function focusInput() {
    input.current?.focus()
  }

  useImperativeHandle(ref, () => input.current)

  return (
    <Pressable onPress={focusInput}>
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
              <Checkbox isChecked={value} value={value} {...CheckboxInputProps} {...field}>
                {!!(label || labelTx) && (
                  <Text
                    text={label}
                    tx={labelTx}
                    // fontFamily="mono"
                    fontSize="sm"
                    colorToken="text.soft"
                    txOptions={labelTxOptions}
                    // isFormLabel={true}
                  />
                )}
              </Checkbox>

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
