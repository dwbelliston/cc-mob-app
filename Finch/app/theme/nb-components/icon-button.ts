// https://github.com/GeekyAnts/NativeBase/blob/master/src/theme/components/icon-button.ts

const baseStyle = (props: any) => {
  const { colorScheme } = props;
  const colors = props.theme.colors;

  return {
    borderRadius: 'sm', // '4px'
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    _web: {
      _disabled: {
        cursor: 'not-allowed',
      },
      _loading: {
        cursor: 'not-allowed',
      },
      cursor: 'pointer',
      userSelect: 'none',
    },
    _focus: {
      borderColor: `${colorScheme}.400`,
    },
    _focusVisible: {
      _web: {
        style: {
          outlineWidth: '2px',
          outlineColor: `${colors[colorScheme][600]}`,
          outlineStyle: 'solid',
        },
      },
    },
    _loading: {
      opacity: '40',
    },
    _disabled: {
      opacity: '40',
    },
    _dark: {
      _focusVisible: {
        _web: {
          style: {
            outlineWidth: '2px',
            outlineColor: `${colors[colorScheme][500]}`,
            outlineStyle: 'solid',
          },
        },
      },
    },
  };
};

function variantGhost({ colorScheme }: Record<string, any>) {
  return {
    _icon: {
      color: `${colorScheme}.600`,
    },
    _hover: {
      bg: `${colorScheme}.600:alpha.10`,
    },
    _pressed: {
      bg: `${colorScheme}.600:alpha.20`,
    },
    _dark: {
      _icon: {
        color: `${colorScheme}.500`,
      },
      _hover: {
        bg: `${colorScheme}.500:alpha.10`,
      },
      _pressed: {
        bg: `${colorScheme}.500:alpha.20`,
      },
    },
  };
}

function variantOutline({ colorScheme }: Record<string, any>) {
  return {
    borderWidth: '1px',
    borderColor: `${colorScheme}.600`,
    _icon: {
      color: `${colorScheme}.600`,
    },
    _hover: {
      bg: `${colorScheme}.700`,
      _icon: {
        color: 'muted.50',
      },
    },
    _pressed: {
      bg: `${colorScheme}.800`,
      _icon: {
        color: 'muted.50',
      },
    },
    _focus: {
      bg: `${colorScheme}.600`,
      _icon: {
        color: 'muted.50',
      },
    },
    _dark: {
      borderColor: `${colorScheme}.500`,
      _icon: {
        color: `${colorScheme}.500`,
      },
      _hover: {
        bg: `${colorScheme}.400`,
        _icon: {
          color: 'muted.900',
        },
      },
      _pressed: {
        bg: `${colorScheme}.300`,
        _icon: {
          color: 'muted.900',
        },
      },
      _focus: {
        bg: `${colorScheme}.500`,
        _icon: {
          color: 'muted.900',
        },
      },
    },
  };
}

function variantSolid({ colorScheme }: Record<string, any>) {
  let styles = {
    _light: {
      bg: `${colorScheme}.600`,
      borderColor: `${colorScheme}.600`,
      _text: {
        color: "white",
      },
      _icon: {
        color: "red.400",
      },
      _hover: {
        bg: `${colorScheme}.500`,
        borderColor: `${colorScheme}.500`,
      },
      _pressed: {
        bg: `${colorScheme}.400`,
        borderColor: `${colorScheme}.500`,
      },
      _spinner: {
        color: "white",
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
      _spinner: {
        color: "white",
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
        _spinner: {
          color: `${colorScheme}.700`,
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
        _spinner: {
          color: `${colorScheme}.700`,
        },
      },
    }
  }

  return {
    borderWidth: "1px",
    _loading: {
      opacity: 80
    },
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
      _spinner: {
        color: styles._light._spinner.color,
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
      _spinner: {
        color: styles._dark._spinner.color,
      },
    },
  }
}

function variantSubtle({ colorScheme }: Record<string, any>) {
  return {
    shadow: "unset",
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
        color: `${colorScheme}.200`,
      },
      _text: {
        color: `${colorScheme}.200`,
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
  };
}

function variantLink({ colorScheme }: Record<string, any>) {
  return {
    _spinner: {
      color: `${colorScheme}.600`,
    },

    _icon: {
      color: `${colorScheme}.600`,
    },
    _hover: {
      _icon: {
        color: `${colorScheme}.700`,
      },
    },
    _pressed: {
      _icon: {
        color: `${colorScheme}.800`,
      },
    },
    _dark: {
      _icon: {
        color: `${colorScheme}.500`,
      },
      _hover: {
        _icon: {
          color: `${colorScheme}.400`,
        },
      },
      _pressed: {
        _icon: {
          color: `${colorScheme}.300`,
        },
      },
    },
  };
}

function variantUnstyled() {
  return {
    _icon: {
      color: 'muted.900',
    },
    _dark: {
      _icon: {
        color: 'muted.50',
      },
    },
  };
}

const variants = {
  ghost: variantGhost,
  outline: variantOutline,
  solid: variantSolid,
  subtle: variantSubtle,
  link: variantLink,
  unstyled: variantUnstyled,
};

const sizes = {
  lg: {
    p: '3',
    _icon: {
      size: 'lg',
    },
  },
  md: {
    p: '2.5',
    _icon: {
      size: 'md',
    },
  },
  sm: {
    p: '2',
    _icon: {
      size: 'sm',
    },
  },
  xs: {
    p: '1.5',
    _icon: {
      size: 'xs',
    },
  },
};

const defaultProps = {
  size: 'md',
  colorScheme: "gray",
  variant: "solid",
};

export default {
  baseStyle,
  variants,
  sizes,
  defaultProps,
};