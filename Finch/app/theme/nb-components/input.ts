// https://github.com/GeekyAnts/NativeBase/blob/master/src/theme/components/input.ts

import { InterfaceInputProps } from "native-base/lib/typescript/components/primitives/Input/types";




const baseStyle = (props: InterfaceInputProps & { theme: any }) => {
  const { primary, error } = props.theme.colors;

  return {
    // fontFamily: 'mono',
    borderRadius: 'xl',
    overflow: 'hidden',
    px: 4,
    py: 4,
    _input: {
      bg: 'transparent',
      flex: 1,
      w: '100%',
      h: '100%',
    },
    _disabled: {
      opacity: '0.4',
      _web: {
        disabled: true,
        cursor: 'not-allowed',
      },
    },
    _light: {
      borderColor: "gray.300",
      bg: "white",
      placeholderTextColor: 'gray.400',
      color: 'gray.800',
      _focus: {
        bg: "primary.50",
        borderColor: 'primary.600',
        _invalid: {
          borderColor: 'error.600',
          _hover: { borderColor: 'error.600' },
          _stack: {
            style: {
              outlineWidth: '0',
              boxShadow: `0 0 0 1px ${error[600]}`,
            },
          },
        },
        _ios: {
          selectionColor: 'primary.800',
        },
        _android: {
          selectionColor: 'gray.800',
        },
        _disabled: {
          placeholderTextColor: 'muted.700',
          _hover: {
            borderColor: 'muted.300',
          },
        },
        _stack: {
          style: {
            outlineWidth: '0',
            boxShadow: `0 0 0 1px ${primary[600]}`,
          },
        },
      },
      _invalid: {
        borderColor: "error.600"
      }
    },
    _dark: {
      borderColor: "gray.600",
      bg: "gray.900",
      placeholderTextColor: 'gray.400',
      _input: {
        color: 'white',
      },
      _focus: {
        bg: "gray.800",
        borderColor: 'primary.400',
        _invalid: {
          borderColor: 'error.200',
          color: 'error.200',
          _hover: { borderColor: 'error.200' },
          _stack: {
            style: {
              outlineWidth: '0',
              boxShadow: `0 0 0 1px ${error[600]}`,
            },
          },
        },
        _ios: {
          selectionColor: 'primary.800',
        },
        _android: {
          selectionColor: 'gray.800',
        },
        _disabled: {
          placeholderTextColor: 'muted.700',
          _hover: {
            borderColor: 'muted.300',
          },
        },
        _stack: {
          style: {
            outlineWidth: '0',
            boxShadow: `0 0 0 1px ${primary[600]}`,
          },
        },
      },
      _invalid: {
        borderColor: "error.400"
      }
    },
  };
};

function roundedStyle(props: InterfaceInputProps & { theme: any }) {
  const { theme } = props;
  return {
    borderRadius: 'full',
    borderWidth: '1',
    // _focus: {
    //   bg: transparentize('primary.600', 0.1)(theme),
    // },
  };
}
function outlineStyle(props: InterfaceInputProps & { theme: any }) {
  const { theme } = props;

  return {
    borderWidth: '1',

  };
}

function filledStyle(props: InterfaceInputProps & { theme: any }) {
  const { theme } = props;
  return {
    borderWidth: '1',
    // _focus: {
    //   bg: transparentize('primary.600', 0.1)(theme),
    // },
    _hover: {
      borderWidth: '1',
      _disabled: {
        borderWidth: 0,
      },
    },
    bg: 'muted.100',
    borderColor: 'muted.100',

    _dark: {
      bg: 'muted.800',
      borderColor: 'muted.800',
    },
  };
}
function unstyledStyle() {
  return {
    borderWidth: '0',
    _focus: {
      bg: 'transparent',
    },
    _invalid: {
      _stack: {
        style: {
          outlineWidth: 0,
        },
      },
    },
    _stack: {
      _focus: {
        style: {
          outlineWidth: '0',
        },
      },
    },
  };
}
function underlinedStyle(props: InterfaceInputProps & { theme: any }) {
  const { primary, error } = props.theme.colors;

  return {
    borderWidth: '0',
    pl: '0',
    borderBottomWidth: '1',
    _focus: {
      _stack: {
        style: {
          outlineWidth: '0',
          boxShadow: `0 1px 0 0 ${primary[600]}`,
        },
      },
    },
    _invalid: {
      _stack: {
        style: {
          outlineWidth: 0,
          boxShadow: `0 1px 0 0 ${error[600]}`,
        },
      },
    },

    _dark: {
      _focus: {
        _stack: {
          style: {
            outlineWidth: '0',
            boxShadow: `0 1px 0 0 ${primary[500]}`,
          },
        },
      },
      _invalid: {
        _stack: {
          style: {
            outlineWidth: 0,
            boxShadow: `0 1px 0 0 ${error[500]}`,
          },
        },
      },
    },
    borderRadius: 0,
  };
}

const variants = {
  outline: outlineStyle as any,
  underlined: underlinedStyle as any,
  rounded: roundedStyle as any,
  filled: filledStyle as any,
  unstyled: unstyledStyle as any,
};

const sizes = {
  '2xl': { fontSize: 'xl' },
  'xl': { fontSize: 'xl' },
  'lg': { fontSize: 'lg' },
  'md': { fontSize: 'md' },
  'sm': { fontSize: 'sm' },
  'xs': { fontSize: 'xs' },
};

const defaultProps = {
  size: 'md',
  variant: 'outline',
};

// Input
export default {
  baseStyle,
  defaultProps,
  variants,
  sizes,
};
