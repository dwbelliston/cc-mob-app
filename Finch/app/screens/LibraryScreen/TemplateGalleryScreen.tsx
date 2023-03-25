import * as Haptics from "expo-haptics"
import * as WebBrowser from "expo-web-browser"
import { observer } from "mobx-react-lite"
import { Box, HStack, Pressable, Skeleton, Stack, View } from "native-base"
import React, { FC } from "react"
import { ImageBackground } from "react-native"
import appConfig from "../../../app-config"
import { Icon, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { IClientFormTemplate } from "../../models/ClientFormTemplate"
import { AppStackScreenProps } from "../../navigators"
import useListClientFormTemplates from "../../services/api/clientformtemplates/queries/useListClientFormTemplates"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

const CLIENT_APP_HOST = appConfig.Web.clientHost

export const TemplateGalleryScreen: FC<AppStackScreenProps<"Login">> = observer(
  function TemplateGalleryScreen(_props) {
    const { libraryStore } = useStores()

    const bgBadge = useColor("bg.higher")
    const colorBadge = useColor("text")
    const borderCardColor = useColor("text.softest")

    const { data: dataTemplates, isLoading: isLoadingTemplates } = useListClientFormTemplates()

    const handleViewTemplate = (template: IClientFormTemplate) => {
      Haptics.selectionAsync()

      const urlToOpen = `${CLIENT_APP_HOST}/t/${template.ClientFormTemplateId}`
      WebBrowser.openBrowserAsync(urlToOpen)
    }

    React.useEffect(() => {
      const useCasesSet = new Set<string>()

      dataTemplates?.records?.forEach((tmp) => useCasesSet.add(tmp.UseCase))
      libraryStore.setUseCases(Array.from(useCasesSet))
    }, [dataTemplates])

    return (
      <Screen
        preset="scroll"
        contentContainerStyle={{
          paddingTop: spacing.large,
          paddingBottom: spacing.small,
        }}
      >
        <Stack space={4}>
          <Stack px={spacing.tiny}>
            <Text fontSize="lg" preset="subheading" tx="library.galleryHeader"></Text>
            <Text colorToken="text.softer" fontSize="md" tx="library.gallerySubHeader"></Text>
          </Stack>

          {isLoadingTemplates ? (
            <Stack space={spacing.tiny} px={spacing.tiny}>
              <Skeleton h="48" rounded="lg" />
              <Skeleton h="48" rounded="lg" />
              <Skeleton h="48" rounded="lg" />
            </Stack>
          ) : null}

          <Stack space={spacing.small}>
            {dataTemplates?.records
              .filter((template) => {
                if (!libraryStore.useCaseFilter) {
                  return true
                }
                return template.UseCase === libraryStore.useCaseFilter
              })
              .map((template) => {
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
                          <View pb={spacing.huge} px={spacing.tiny} pt={spacing.tiny}></View>
                        </ImageBackground>
                        <Stack
                          px={spacing.tiny}
                          pt={spacing.tiny}
                          space={spacing.tiny}
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
                          <HStack justifyContent={"space-between"} alignItems="center">
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
                            <Icon
                              colorToken={"text.softer"}
                              icon="arrow-top-right-on-square"
                            ></Icon>
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
