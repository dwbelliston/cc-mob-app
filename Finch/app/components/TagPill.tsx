import { Box, HStack, IStackProps } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { ITag } from "../models/Tag"
import { spacing } from "../theme"
import { Icon } from "./Icon"
import { Text } from "./Text"

export interface ITagPillProps extends IStackProps {
  tag: ITag
}

const Single = ({ tag, ...rest }: ITagPillProps) => {
  return (
    <HStack
      rounded={"sm"}
      py={1}
      px={spacing.tiny}
      bg={tag.Color}
      alignItems="center"
      // width={isTruncated ? "min-content" : "100%"}
      // maxWidth="100%"
      // isTruncated={isTruncated}
      // justify="start"
      space={spacing.micro}
    >
      <Icon color="white" size={16} icon="tag"></Icon>
      <Text color="white" fontSize="sm" isTruncated={true} text={tag.Title}></Text>
    </HStack>
  )
}

interface ITagPillGroupProps {
  tags: ITag[]
}

const Group = ({ tags }: ITagPillGroupProps) => {
  return (
    <HStack space={spacing.micro} flexWrap="wrap" style={styles.container}>
      {tags.map((tag) => {
        return (
          <Box maxW={"full"} key={tag.TagId} style={styles.child}>
            <Single tag={tag} />
          </Box>
        )
      })}
    </HStack>
  )
}

export const TagPill = {
  Single,
  Group,
}

const gap = 4

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginVertical: -(gap / 2),
    marginHorizontal: -(gap / 2),
  },
  child: {
    marginVertical: gap / 2,
    marginHorizontal: gap / 2,
  },
})
