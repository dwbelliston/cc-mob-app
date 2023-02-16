// https://reactnavigation.org/docs/drawer-navigator/#options

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer"
import React from "react"

import { DrawerActions, NavigatorScreenParams, useNavigation } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"

import { Box, HStack, IconButton, Stack, useColorModeValue } from "native-base"
import { Button, Icon, Text } from "../components"
import { useStores } from "../models"
import { SettingsScreen } from "../screens/SettingsScreen"
import { colors, spacing } from "../theme"

const concentricSrc = require("../../assets/images/img-concentric-bl.png")

import { Dot } from "../components/Dot"
import { UserAvatar } from "../components/UserAvatar"
import { useUserName, useUserPhone } from "../models/UserProfile"
import useReadUserProfile from "../services/api/userprofile/queries/useReadUserProfile"
import { runFormatPhoneSimple } from "../utils/useFormatPhone"
import { HomeTabNavigator, HomeTabParamList } from "./HomeTabNavigator"

export type AppHomeParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>
  Conversations: undefined
  Contacts: undefined
  Profile: undefined
  Settings: undefined
}

export type AppHomeScreenProps<T extends keyof AppHomeParamList> = StackScreenProps<
  AppHomeParamList,
  T
>

const Drawer = createDrawerNavigator<AppHomeParamList>()

const CustomDrawerContent = (props: any) => {
  const {
    authenticationStore: { logout },
  } = useStores()

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
                  text={userProfile.CompanyName}
                ></Text>
              </Stack>
            </HStack>
          </Box>

          <HStack px={spacing.micro} space={2} alignItems="center">
            {userProfile?.IsPhoneRegistered ? (
              <Dot.Success></Dot.Success>
            ) : (
              <Dot.Warning></Dot.Warning>
            )}
            <Text fontSize="lg" colorToken={"text.soft"} colorScheme={"gray"} fontWeight="semibold">
              {runFormatPhoneSimple(userNumber)}
            </Text>
          </HStack>
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
      </Stack>
    </DrawerContentScrollView>
  )
}

const AppHomeNavigator = () => {
  const drawerBg = useColorModeValue(colors.white, colors.gray[900])

  const activeBg = useColorModeValue(colors.gray[100], colors.gray[800])
  const activeColor = useColorModeValue(colors.gray[900], colors.white)

  const inActiveBg = useColorModeValue(colors.white, colors.gray[900])
  const inActiveColor = useColorModeValue(colors.black, colors.gray[100])

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
          height: 120,
        },
        headerLeftContainerStyle: { paddingLeft: spacing.small },
        headerTitleContainerStyle: { width: "100%" },
        headerRightContainerStyle: { paddingRight: spacing.small },
        headerTransparent: true,
        drawerItemStyle: {
          paddingLeft: 16,
          borderRadius: 16,
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
