import * as Haptics from "expo-haptics"
import * as WebBrowser from "expo-web-browser"
import { observer } from "mobx-react-lite"
import { Box, HStack, Pressable, Stack, View } from "native-base"
import React, { FC } from "react"
import { ImageBackground } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import appConfig from "../../../app-config"
import { Screen, Text } from "../../components"
import { IClientFormTemplate } from "../../models/ClientFormTemplate"
import { AppStackScreenProps } from "../../navigators"
import useListClientFormTemplates from "../../services/api/clientformtemplates/queries/useListClientFormTemplates"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

const CLIENT_APP_HOST = appConfig.Web.clientHost

export const TemplateGalleryScreen: FC<AppStackScreenProps<"Login">> = observer(
  function TemplateGalleryScreen(_props) {
    // const { route, navigation } = _props

    const { top: topInset } = useSafeAreaInsets()

    const bgBadge = useColor("bg.higher")
    const colorBadge = useColor("text")
    const borderCardColor = useColor("text.softest")

    const { data: dataTemplates } = useListClientFormTemplates()

    const handleViewTemplate = (template: IClientFormTemplate) => {
      Haptics.selectionAsync()

      const urlToOpen = `${CLIENT_APP_HOST}/t/${template.ClientFormTemplateId}`
      WebBrowser.openBrowserAsync(urlToOpen)
    }

    return (
      <Screen
        preset="scroll"
        safeAreaEdges={["top", "bottom"]}
        contentContainerStyle={{ marginTop: topInset + spacing.large }}
      >
        <Stack space={4} py={spacing.extraSmall}>
          <Stack space={spacing.small}>
            {dataTemplates?.records.map((template) => {
              const image = { uri: template.TemplateImageUrl }
              return (
                <Pressable
                  key={template.ClientFormTemplateId}
                  onPress={() => handleViewTemplate(template)}
                >
                  <Box px={spacing.tiny}>
                    <Stack
                      borderWidth={1}
                      borderColor={borderCardColor}
                      rounded="lg"
                      overflow={"hidden"}
                    >
                      <ImageBackground
                        source={image}
                        resizeMode="cover"
                        imageStyle={{ borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
                      >
                        <View pb={spacing.massive} px={spacing.tiny} pt={spacing.tiny}></View>
                      </ImageBackground>
                      <Stack
                        px={spacing.tiny}
                        pt={spacing.micro}
                        space={spacing.micro}
                        pb={spacing.extraSmall}
                      >
                        <Stack>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            text={template.TemplateTitle}
                          ></Text>
                          <Text fontSize="sm" text={template.TemplateDescription}></Text>
                        </Stack>
                        <HStack>
                          <Box
                            bg={bgBadge}
                            rounded="sm"
                            borderWidth={1}
                            borderColor={borderCardColor}
                            py={0.5}
                            px={spacing.micro}
                          >
                            <Text
                              display="inline"
                              fontFamily={"mono"}
                              fontSize="xs"
                              color={colorBadge}
                              text={template.UseCase}
                            ></Text>
                          </Box>
                        </HStack>
                      </Stack>
                    </Stack>
                  </Box>
                </Pressable>
              )
            })}
          </Stack>
        </Stack>
      </Screen>
    )
  },
)
