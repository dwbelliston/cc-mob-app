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

import { Badge, Box, HStack, IconButton, Image, Stack, useColorModeValue } from "native-base"
import { Button, Icon, Text } from "../components"
import { useStores } from "../models"
import { SettingsScreen } from "../screens/SettingsScreen"
import { colors, spacing } from "../theme"
import { useColor } from "../theme/useColor"

const concentricSrc = require("../../assets/images/img-concentric-bl.png")

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
      <Stack space={12} flex={1}>
        <Stack space={spacing.extraSmall} px={spacing.tiny}>
          <Box pt={spacing.tiny}>
            <HStack space={spacing.tiny} alignItems="center">
              <Avatar
                bg="primary.700"
                _dark={{
                  bg: "primary.500",
                  _text: {
                    color: "black",
                  },
                }}
                _text={{
                  color: "white",
                }}
                size="md"
                // source={{
                //   uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                // }}
              >
                DB
              </Avatar>
              <Stack flex={1}>
                <Text
                  colorToken={"text"}
                  noOfLines={1}
                  fontSize="md"
                  fontWeight={"semibold"}
                  text={"Ray Dalio"}
                ></Text>
                <Text
                  noOfLines={1}
                  fontSize="sm"
                  colorToken={"text.softer"}
                  text={"Bridgewater"}
                ></Text>
              </Stack>
            </HStack>
          </Box>

          <Stack space={1}>
            <Text fontSize="xs" colorToken={"text"} noOfLines={1} tx={"common.myNumber"}></Text>
            <Badge colorScheme={"gray"}>(385) 323-3434</Badge>
          </Stack>
        </Stack>

        <DrawerItemList {...props} />

        <DrawerItem
          style={{
            marginTop: 24,
            paddingLeft: 12,
            width: "100%",
          }}
          onPress={() => {}}
          label={() => (
            <Button
              size="sm"
              onPress={logout}
              leftIcon={<Icon icon="arrow-left-on-rectangle"></Icon>}
              tx="navigator.signout"
              variant="subtle"
              colorScheme={"error"}
            ></Button>
          )}
        />

        <Box pt={48}></Box>
        <Box position={"absolute"} bottom={0}>
          <Image height="48" source={concentricSrc} resizeMode="contain" alt="geneial logo" />
        </Box>
      </Stack>

      {/* </ImageBackground> */}
    </DrawerContentScrollView>
  )
}

const AppHomeNavigator = () => {
  const drawerBg = useColorModeValue(colors.white, colors.gray[900])

  const activeBg = useColorModeValue(colors.gray[100], colors.gray[800])
  const activeColor = useColorModeValue(colors.gray[900], colors.white)

  const inActiveBg = useColorModeValue(colors.white, colors.gray[900])
  const inActiveColor = useColorModeValue(colors.black, colors.gray[600])

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
          paddingLeft: 12,
          borderRadius: 12,
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
            <Text color={color} fontSize="xs" tx="navigator.homeTab"></Text>
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
            <Text color={color} fontSize="xs" tx="navigator.settings"></Text>
          ),
        }}
      />
    </Drawer.Navigator>
  )
}

export default AppHomeNavigator
