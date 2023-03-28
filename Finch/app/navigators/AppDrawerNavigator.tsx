// https://reactnavigation.org/docs/drawer-navigator/#options

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerScreenProps,
} from "@react-navigation/drawer"
import React from "react"

import { DrawerActions, NavigatorScreenParams, useNavigation } from "@react-navigation/native"

import { Box, HStack, Stack, useColorModeValue } from "native-base"
import { Icon, Text } from "../components"
import { colors, spacing } from "../theme"

import { UserAvatar } from "../components/UserAvatar"
import { UserPhone } from "../components/UserPhone"
import { useUserName, useUserPhone } from "../models/UserProfile"
import {
  BroadcastsStack,
  BroadcastsStackParamList,
} from "../screens/BroadcastsScreen/BroadcastsStack"

import { LibraryStack, LibraryStackParamList } from "../screens/LibraryScreen/LibraryStack"
import {
  ManageContactsStack,
  ManageContactsStackParamList,
} from "../screens/ManageContactsStack/ManageContactsStack"

import { ManagePhoneStack } from "../screens/ManagePhoneStack/ManagePhoneStack"
import { SettingsStack, SettingsStackParamList } from "../screens/SettingsStack/SettingsStack"
import useReadUserProfile from "../services/api/userprofile/queries/useReadUserProfile"
import { useColor } from "../theme/useColor"
import { HomeTabNavigator, HomeTabParamList } from "./HomeTabNavigator"

export type AppDrawerParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>
  SettingsStack: NavigatorScreenParams<SettingsStackParamList>
  BroadcastsStack: NavigatorScreenParams<BroadcastsStackParamList>
  LibraryStack: NavigatorScreenParams<LibraryStackParamList>
  ManageContactsStack: NavigatorScreenParams<ManageContactsStackParamList>
  ManagePhoneStack: NavigatorScreenParams<ManageContactsStackParamList>
}

export type AppDrawerScreenProps<T extends keyof AppDrawerParamList> = DrawerScreenProps<
  AppDrawerParamList,
  T
>

const Drawer = createDrawerNavigator<AppDrawerParamList>()

const CustomDrawerContent = (props: any) => {
  const navigation = useNavigation()

  const { data: userProfile } = useReadUserProfile()

  const userNumber = useUserPhone(userProfile)
  const userUserName = useUserName(userProfile)

  const handleOnPressSettings = () => {
    navigation.dispatch(DrawerActions.toggleDrawer())
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ minHeight: "100%" }}>
      <Stack space={12} flex={1}>
        <Stack space={spacing.extraSmall} px={spacing.tiny}>
          <Box pt={spacing.micro}>
            <HStack space={spacing.tiny} alignItems="center">
              <UserAvatar onPress={handleOnPressSettings}></UserAvatar>
              <Stack flex={1}>
                <Text
                  colorToken={"text"}
                  noOfLines={1}
                  fontSize="md"
                  fontWeight={"semibold"}
                  text={userUserName}
                ></Text>
                <Text
                  noOfLines={1}
                  fontSize="sm"
                  colorToken={"text.softer"}
                  text={userProfile?.CompanyName}
                ></Text>
              </Stack>
            </HStack>
          </Box>

          <UserPhone />
        </Stack>

        <DrawerItemList {...props} />
      </Stack>
    </DrawerContentScrollView>
  )
}

const AppDrawerNavigator = (_props) => {
  const drawerBg = useColorModeValue(colors.white, colors.gray[900])

  const activeBg = useColorModeValue(colors.gray[100], colors.gray[800])
  const activeColor = useColorModeValue(colors.gray[900], colors.white)
  const headerDetailBg = useColor("bg.header")
  const inActiveBg = useColorModeValue(colors.white, colors.gray[900])
  const inActiveColor = useColorModeValue(colors.black, colors.gray[100])

  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        drawerType: "front",
        drawerStyle: {
          backgroundColor: drawerBg,
        },
        drawerActiveTintColor: activeColor,
        drawerInactiveTintColor: inActiveColor,
        drawerActiveBackgroundColor: activeBg,
        drawerInactiveBackgroundColor: inActiveBg,
        headerShown: false,
        headerStyle: {
          height: 120,
        },
        headerLeftContainerStyle: { paddingLeft: spacing.small },
        headerTitleContainerStyle: { width: "100%" },
        headerRightContainerStyle: { paddingRight: spacing.small },
        headerTransparent: true,
        drawerItemStyle: {
          paddingLeft: spacing.tiny,
          borderRadius: spacing.extraSmall,
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
              <Text
                textAlign={"center"}
                colorToken="text.soft"
                preset="heading"
                fontSize="lg"
                text={children}
              />
            </Box>
          )
        },
        // // header: () => {},
        // headerLeft: (props) => (
        //   <IconButton
        //     onPress={navigation.toggleDrawer}
        //     icon={<Icon icon="menu" size={24} color={inActiveColor} />}
        //   ></IconButton>
        // ),
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
        name="BroadcastsStack"
        component={BroadcastsStack}
        options={{
          drawerIcon: ({ color }) => <Icon icon="megaphone" size={20} color={color} />,
          drawerLabel: ({ color }) => (
            <Text color={color} fontSize="sm" tx="navigator.broadcasts"></Text>
          ),
        }}
      />
      <Drawer.Screen
        name="LibraryStack"
        component={LibraryStack}
        options={{
          drawerIcon: ({ color }) => <Icon icon="rectangleGroup" size={20} color={color} />,
          drawerLabel: ({ color }) => (
            <Text color={color} fontSize="sm" tx="navigator.library"></Text>
          ),
        }}
      />

      <Drawer.Screen
        name="ManageContactsStack"
        component={ManageContactsStack}
        options={{
          drawerIcon: ({ color }) => <Icon icon="contacts" size={20} color={color} />,
          drawerLabel: ({ color }) => (
            <Text color={color} fontSize="sm" tx="navigator.contacts"></Text>
          ),
        }}
      />
      <Drawer.Screen
        name="ManagePhoneStack"
        component={ManagePhoneStack}
        options={{
          drawerIcon: ({ color }) => <Icon icon="phone" size={20} color={color} />,
          drawerLabel: ({ color }) => (
            <Text color={color} fontSize="sm" tx="navigator.phone"></Text>
          ),
        }}
      />

      <Drawer.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          drawerIcon: ({ color }) => <Icon icon="adjustmentsVertical" size={20} color={color} />,
          drawerLabel: ({ color }) => (
            <Text color={color} fontSize="sm" tx="navigator.settings"></Text>
          ),
        }}
      />
    </Drawer.Navigator>
  )
}

export default AppDrawerNavigator
