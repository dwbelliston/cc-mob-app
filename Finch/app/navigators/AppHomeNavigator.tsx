// https://reactnavigation.org/docs/drawer-navigator/#options

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer"
import React from "react"

import { NavigatorScreenParams } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"

import { Box, HStack, IconButton, Stack, useColorModeValue } from "native-base"
import { Linking } from "react-native"
import { Button, Icon, Text } from "../components"
import { useStores } from "../models"
import { SettingsScreen } from "../screens/SettingsScreen"
import { colors, spacing } from "../theme"
import { useColor } from "../theme/useColor"

import { Avatar } from "native-base"
import { HomeTabNavigator, HomeTabParamList } from "./HomeTabNavigator"

export type AppHomeParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>
  Profile: undefined
  Settings: undefined
}

export type AppHomeScreenProps<T extends keyof AppHomeParamList> = StackScreenProps<
  AppHomeParamList,
  T
>

const Drawer = createDrawerNavigator<AppHomeParamList>()

// const genialLogoGreen = require("../../assets/logo-full-green.png");
// const genialLogoWhite = require("../../assets/logo-full-white.png");
// const imgDark = require("../../assets/blob-dark.png");
// const imgLight = require("../../assets/blob-light.png");

const CustomDrawerContent = (props: any) => {
  const {
    authenticationStore: { logout },
  } = useStores()

  // const imgLogoSrc = useColorModeValue(genialLogoGreen, genialLogoWhite);
  // const imgHelloSrc = useColorModeValue(imgLight, imgDark);

  // const redColor = useColorModeValue(
  //   colors.palette.red[600],
  //   colors.palette.red[200]
  // );
  // const inActiveColor = useColorModeValue(
  //   colors.palette.gray[500],
  //   colors.palette.gray[600]
  // );

  const borderColor = useColor("border")
  const inActiveColor = useColorModeValue(colors.gray[700], colors.gray[600])

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ minHeight: "100%" }}>
      {/* <ImageBackground
        source={imgHelloSrc}
        resizeMode="cover"
        style={{ minHeight: "100%" }}
      > */}
      <Stack space={6} flex={1}>
        <Box px="4">
          <Box pt={4} pb={6}>
            <HStack space={spacing.tiny}>
              <Avatar
                bg="cyan.500"
                source={{
                  uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                }}
              >
                TE
              </Avatar>
              <Stack>
                <Text fontWeight={"semibold"} text={"Dustin Belliston"}></Text>
                <Text colorToken={"text.soft"} text={"324-343-4443"}></Text>
              </Stack>
            </HStack>
            {/* <Image
                height="12"
                w="32"
                source={imgLogoSrc}
                resizeMode="contain"
                alt="geneial logo"
              /> */}
          </Box>
        </Box>

        <DrawerItemList {...props} />

        <DrawerItem
          style={{
            paddingLeft: 8,
          }}
          // label="Feedback"
          icon={() => (
            <Icon
              icon="arrow-top-right-on-square"
              color={inActiveColor}
              size={20}
              // icon="arrow-top-right"
            ></Icon>
          )}
          onPress={() => Linking.openURL("https://currentclient.com")}
          label={({ color }) => (
            <Text fontSize="sm" color={inActiveColor} tx="navigator.feedback"></Text>
          )}
        />

        <DrawerItem
          style={{
            paddingLeft: 8,
          }}
          icon={() => <Icon colorToken={"error"} icon="arrow-left-on-rectangle"></Icon>}
          onPress={logout}
          label={() => <Button tx="navigator.signout" colorScheme={"error"}></Button>}
        />
      </Stack>
      {/* </ImageBackground> */}
    </DrawerContentScrollView>
  )
}

const AppHomeNavigator = () => {
  const drawerBg = useColorModeValue(colors.white, colors.gray[900])

  const activeColor = useColorModeValue(colors.primary[600], colors.white)

  const inActiveBg = useColorModeValue(colors.white, colors.gray[900])

  const activeBg = useColorModeValue(colors.primary[50], colors.gray[800])

  const inActiveColor = useColorModeValue(colors.gray[700], colors.gray[600])

  const tintColor = useColorModeValue("light", "dark")

  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          backgroundColor: drawerBg,
        },
        drawerActiveTintColor: activeColor,
        drawerInactiveTintColor: inActiveColor,
        drawerActiveBackgroundColor: activeBg,
        drawerInactiveBackgroundColor: inActiveBg,
        headerShown: false,
        headerStyle: {
          height: 140,
        },
        headerLeftContainerStyle: { paddingLeft: spacing.small },
        headerTitleContainerStyle: { width: "100%" },
        headerRightContainerStyle: { paddingRight: spacing.small },
        headerTransparent: true,
        drawerItemStyle: {
          paddingLeft: 8,
        },
        headerTitleAlign: "center",
        // headerBackground: () => (
        //   <BlurView
        //     tint={tintColor}
        //     intensity={80}
        //     style={StyleSheet.absoluteFill}
        //   />
        // ),
        headerTitle: ({ children }) => {
          return (
            <Box w="full">
              <Text textAlign="center" preset="heading" text={children} />
            </Box>
          )
        },
        // // header: () => {},
        headerLeft: (props) => (
          <IconButton
            onPress={navigation.toggleDrawer}
            icon={<Icon icon="menu" size={24} color={inActiveColor} />}
          ></IconButton>
        ),
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeTabNavigator}
        options={{
          drawerIcon: ({ color }) => <Icon icon="home" size={20} color={color} />,
          drawerLabel: ({ color }) => (
            <Text color={color} fontSize="sm" tx="navigator.homeTab"></Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          drawerIcon: ({ color }) => <Icon icon="settings" size={20} color={color} />,
          drawerLabel: ({ color }) => (
            <Text color={color} fontSize="sm" tx="navigator.settings"></Text>
          ),
        }}
      />
    </Drawer.Navigator>
  )
}

export default AppHomeNavigator
