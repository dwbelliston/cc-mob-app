// https://github.com/GeekyAnts/NativeBase/blob/master/src/theme/components/button.ts

export default {
  baseStyle: () => {
    return {
      borderRadius: "md",
      shadow: 1,
      // fontFamily: "mono",
      _text: {
        fontWeight: 500,
      },
    }
  },
  sizes: {
  //   lg: {
  //     // h: 16,
  //     _text: {
  //       fontSize: "xl",
  //       lineHeight: "20"
  //     },
  //   },
  //   md: {
  //     _text: {
  //       fontSize: "lg",
  //       lineHeight: "20"
  //     },
  //   },
  //   sm: {
  //     // h: 10,
  //     _text: {
  //       fontSize: "md",
  //       lineHeight: "20"
  //     },
  //   },
  },
  defaultProps: {
    colorScheme: "gray",
    variant: "solid",
  },
  variants: {
    solid: ({ colorScheme }: { colorScheme: string }) => {
      let styles = {
        _light: {
          bg: `${colorScheme}.600`,
          borderColor: `${colorScheme}.600`,
          _text: {
            color: "white",
          },
          _icon: {
            color: "white",
          },
          _hover: {
            bg: `${colorScheme}.500`,
            borderColor: `${colorScheme}.500`,
          },
          _pressed: {
            bg: `${colorScheme}.400`,
            borderColor: `${colorScheme}.500`,
          },
        },
        _dark: {
          bg: `${colorScheme}.600`,
          borderColor: `${colorScheme}.600`,
          _text: {
            color: "white",
          },
          _icon: {
            color: "white",
          },
          _hover: {
            bg: `${colorScheme}.500`,
            borderColor: `${colorScheme}.500`,
          },
          _pressed: {
            bg: `${colorScheme}.800`,
            borderColor: `${colorScheme}.800`,
          },
        },
      }

      if (colorScheme === "gray") {
        styles = {
          _light: {
            bg: "white",
            borderColor: `${colorScheme}.300`,
            _text: {
              color: "gray.800",
            },
            _icon: {
              color: "gray.800",
            },
            _hover: {
              bg: `${colorScheme}.50`,
              borderColor: `${colorScheme}.50`,
            },
            _pressed: {
              bg: `${colorScheme}.100`,
              borderColor: `${colorScheme}.200`,
            },
          },
          _dark: {
            bg: "gray.800",
            borderColor: "gray.600",
            _text: {
              color: "white",
            },
            _icon: {
              color: "white",
            },
            _hover: {
              bg: `${colorScheme}.700`,
              borderColor: `${colorScheme}.700`,
            },
            _pressed: {
              bg: `${colorScheme}.900`,
              borderColor: `${colorScheme}.700`,
            },
          },
        }
      }

      return {
        borderWidth: "1px",
        _light: {
          bg: styles._light.bg,
          borderColor: styles._light.borderColor,
          _text: {
            color: styles._light._text.color,
          },
          _icon: {
            color: styles._light._icon.color,
          },
          _hover: {
            bg: styles._light._hover.bg,
            borderColor: styles._light._hover.borderColor,
          },
          _pressed: {
            bg: styles._light._pressed.bg,
            borderColor: styles._light._pressed.borderColor,
          },
        },
        _dark: {
          bg: styles._dark.bg,
          borderColor: styles._dark.borderColor,
          _text: {
            color: styles._dark._text.color,
          },
          _icon: {
            color: styles._dark._icon.color,
          },
          _hover: {
            bg: styles._dark._hover.bg,
            borderColor: styles._dark._hover.borderColor,
          },
          _pressed: {
            bg: styles._dark._pressed.bg,
            borderColor: styles._dark._pressed.borderColor,
          },
        },
      }
    },
    outline: ({ colorScheme }: { colorScheme: string }) => {
      return {
        borderWidth: "1px",
        _light: {
          bg: `white`,
          borderColor: `${colorScheme}.600`,
          _hover: {
            bg: `${colorScheme}.50`,
            borderColor: `${colorScheme}.50`,
          },
          _pressed: {
            bg: `${colorScheme}.100`,
            borderColor: `${colorScheme}.100`,
          },
        },
        _dark: {
          borderColor: `${colorScheme}.200`,
          bg: `gray.800`,
          _hover: {
            bg: `${colorScheme}.300`,
            borderColor: `${colorScheme}.300`,
          },
          _text: {
            color: `${colorScheme}.200`,
          },
          _pressed: {
            bg: `${colorScheme}.400`,
            borderColor: `${colorScheme}.400`,
          },
        },
      }
    },
    subtle: ({ colorScheme }: { colorScheme: string }) => {
      return {
        _light: {
          bg: `${colorScheme}.100`,
          _icon: {
            color: `${colorScheme}.700`,
          },
          _text: {
            color: `${colorScheme}.800`,
          },
          _spinner: {
            color: `${colorScheme}.900`,
          },
          _hover: {
            bg: `${colorScheme}.200`,
          },
          _pressed: {
            bg: `${colorScheme}.200`,
          },
        },
        _dark: {
          bg: `${colorScheme}.700`,
          _icon: {
            color: `${colorScheme}.300`,
          },
          _text: {
            color: `${colorScheme}.300`,
          },
          _spinner: {
            color: `${colorScheme}.300`,
          },
          _hover: {
            bg: `${colorScheme}.600`,
          },
          _pressed: {
            bg: `${colorScheme}.600`,
          },
        },
      }
    },
  },
}
