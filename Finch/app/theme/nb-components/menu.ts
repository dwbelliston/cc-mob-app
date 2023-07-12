// https://github.com/GeekyAnts/NativeBase/blob/master/src/theme/components/menu.ts

import { StyleSheet } from 'react-native';

const baseStyle = {
  py: 2,
  borderRadius: 'xl',
  shadow: 3,
  bg: 'gray.50',
  _dark: {
    bg: 'gray.800',
  },
  _presenceTransition: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      translateY: 0,
      transition: { duration: 200 },
    },
    exit: { opacity: 0, transition: { duration: 150 } },
    style: StyleSheet.absoluteFill,
  },
  _overlay: {},
  _backdrop: {
    bg: 'transparent',
  },
};

export const Menu =  {
  baseStyle,
};

export const MenuGroup = {
  baseStyle: {
    _title: {
      fontSize: 'xs',
      textTransform: 'uppercase',
      color: 'gray.500',
      _dark: {
        color: 'gray.400',
      },
    },
    p: 3,
  },
};
export const MenuItem = {
  baseStyle: {
    px: 1,
    py: 2,
    mx: 2,
    borderRadius: 'sm',
    _web: {
      outlineWidth: 0,
    },
    _stack: {
      alignItems: 'center',
      px: 3,
      space: 3,
    },
    _icon: {
      size: 4,
      opacity: 0,
      color: 'gray.500',
    },
    _text: {
      color: 'gray.800',
      fontSize: 'md',
    },
    _disabled: {
      _text: {
        color: 'gray.400',
      },
    },
    _hover: {
      bg: 'gray.200',
    },
    _focus: {
      bg: 'gray.300',
    },
    _pressed: {
      bg: 'gray.200',
    },
    _focusVisible: {
      _web: {
        outlineWidth: '0',
        style: { boxShadow: `none` },
        bg: 'gray.300',
      },
    },
    _dark: {
      _text: {
        color: 'white',
      },
      _disabled: {
        _text: {
          color: 'gray.600',
        },
      },
      _hover: {
        bg: 'gray.700',
      },
      _focus: {
        bg: 'gray.600',
      },
      _pressed: {
        bg: 'gray.700',
      },
      _icon: {
        color: 'red.400',
      },
      _focusVisible: {
        _web: {
          outlineWidth: '0',
          style: { boxShadow: `none` },
          bg: 'gray.600',
        },
      },
    },
    _checked: {
      _icon: {
        opacity: 1,
      },
    },
  },
  defaultProps: {},
};