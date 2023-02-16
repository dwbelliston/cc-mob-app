// https://github.com/GeekyAnts/NativeBase/blob/master/src/theme/components/badge.ts

const baseStyle = {
  flexDirection: "row",
  justifyContent: "center",
  space: 1,
  px: "2",
  py: "1",
  alignItems: "center",
  _text: { fontSize: "sm", fontWeight: "medium", fontFamily: "mono" },
}

function variantSubtle(props: any) {
  const { colorScheme } = props


  return {
    borderRadius: "md",
    _light: {
      _text: { color: `${colorScheme}.600` },
      _icon: { color: `${colorScheme}.600` },
      bg: `${colorScheme}.50`,
      borderColor: `${colorScheme}.300`,
    },
    _dark: {
      _text: { color: `${colorScheme}.100` },
      _icon: { color: `${colorScheme}.100` },
      bg: `${colorScheme}.800`,
      borderColor: `${colorScheme}.600`,
    },
  }
}

const variants = {
  subtle: variantSubtle as any,
}

const defaultProps = {
  variant: "subtle",
  colorScheme: "muted",
  size: "md",
}

export default {
  baseStyle,
  variants,
  defaultProps,
}
