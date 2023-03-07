import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black
} from "@expo-google-fonts/inter"
import {
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black
} from "@expo-google-fonts/poppins"

import {
  SourceCodePro_200ExtraLight,
  SourceCodePro_200ExtraLight_Italic,
  SourceCodePro_300Light,
  SourceCodePro_300Light_Italic,
  SourceCodePro_400Regular,
  SourceCodePro_400Regular_Italic,
  SourceCodePro_500Medium,
  SourceCodePro_500Medium_Italic,
  SourceCodePro_600SemiBold,
  SourceCodePro_600SemiBold_Italic,
  SourceCodePro_700Bold,
  SourceCodePro_700Bold_Italic,
  SourceCodePro_900Black,
  SourceCodePro_900Black_Italic
} from "@expo-google-fonts/source-code-pro"

export const customFontsToLoad = {
  AirbnbCerealBlack: require("../../assets/fonts/cereal/AirbnbCerealBlack.ttf"),
  AirbnbCerealBold: require("../../assets/fonts/cereal/AirbnbCerealBold.ttf"),
  AirbnbCerealBook: require("../../assets/fonts/cereal/AirbnbCerealBook.ttf"),
  AirbnbCerealExtraBold: require("../../assets/fonts/cereal/AirbnbCerealExtraBold.ttf"),
  AirbnbCerealLight: require("../../assets/fonts/cereal/AirbnbCerealLight.ttf"),
  AirbnbCerealMedium: require("../../assets/fonts/cereal/AirbnbCerealMedium.ttf"),
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  SourceCodePro_200ExtraLight,
  SourceCodePro_200ExtraLight_Italic,
  SourceCodePro_300Light,
  SourceCodePro_300Light_Italic,
  SourceCodePro_400Regular,
  SourceCodePro_400Regular_Italic,
  SourceCodePro_500Medium,
  SourceCodePro_500Medium_Italic,
  SourceCodePro_600SemiBold,
  SourceCodePro_600SemiBold_Italic,
  SourceCodePro_700Bold,
  SourceCodePro_700Bold_Italic,
  SourceCodePro_900Black,
  SourceCodePro_900Black_Italic,
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
}

export const typography = {
  Inter: {
    100: {
      normal: "Inter_100Thin",
    },
    200: {
      normal: "Inter_200ExtraLight",
    },
    300: {
      normal: "Inter_300Light",
    },
    400: {
      normal: "Inter_400Regular",
    },
    500: {
      normal: "Inter_500Medium",
    },
    600: {
      normal: "Inter_600SemiBold",
    },
    700: {
      normal: "Inter_700Bold",
    },
    800: {
      normal: "Inter_800ExtraBold",
    },
    900: {
      normal: "Inter_900Black",
    },
  },
  Cereal: {
    100: {
      normal: "AirbnbCerealLight",
    },
    200: {
      normal: "AirbnbCerealLight",
    },
    300: {
      normal: "AirbnbCerealBook",
    },
    400: {
      normal: "AirbnbCerealBook",
    },
    500: {
      normal: "AirbnbCerealMedium",
    },
    600: {
      normal: "AirbnbCerealMedium",
    },
    700: {
      normal: "AirbnbCerealBold",
    },
    800: {
      normal: "AirbnbCerealExtraBold",
    },
    900: {
      normal: "AirbnbCerealBlack",
    },
  },
  Poppins: {
    100: {
      normal: "Poppins_100Thin",
    },
    200: {
      normal: "Poppins_200ExtraLight",
    },
    300: {
      normal: "Poppins_300Light",
    },
    400: {
      normal: "Poppins_400Regular",
    },
    500: {
      normal: "Poppins_500Medium",
    },
    600: {
      normal: "Poppins_600SemiBold",
    },
    700: {
      normal: "Poppins_700Bold",
    },
    800: {
      normal: "Poppins_800ExtraBold",
    },
    900: {
      normal: "Poppins_900Black",
    },
  },
  SourecCodePro: {
    200: {
      normal: "SourceCodePro_200ExtraLight",
      italic: "SourceCodePro_200ExtraLight_Italic",
    },
    300: {
      normal: "SourceCodePro_300Light",
      italic: "SourceCodePro_300Light_Italic",
    },
    400: {
      normal: "SourceCodePro_400Regular",
      italic: "SourceCodePro_400Regular_Italic",
    },
    500: {
      normal: "SourceCodePro_500Medium",
      italic: "SourceCodePro_500Medium_Italic",
    },
    600: {
      normal: "SourceCodePro_600SemiBold",
      italic: "SourceCodePro_600SemiBold_Italic",
    },
    700: {
      normal: "SourceCodePro_700Bold",
      italic: "SourceCodePro_700Bold_Italic",
    },
    900: {
      normal: "SourceCodePro_900Black",
      italic: "SourceCodePro_900Black_Italic",
    },
  },
}

export const HEADER_TITLE_STYLES = {
  fontFamily: "AirbnbCerealBold",
  fontWeight: undefined,
}

export const BUTTON_TEXT_STYLES = {
  fontFamily: "Inter_600SemiBold",
  fontWeight: undefined,
}
