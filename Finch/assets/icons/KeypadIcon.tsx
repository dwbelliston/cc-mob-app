import { AspectRatio } from "native-base"
import * as React from "react"
import { SvgXml } from "react-native-svg"

const xml = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="5" r="2" fill="currentColor"/>
<circle cx="17" cy="5" r="2" fill="currentColor"/>
<circle cx="7" cy="5" r="2" fill="currentColor"/>
<circle cx="12" cy="10" r="2" fill="currentColor"/>
<circle cx="17" cy="10" r="2" fill="currentColor"/>
<circle cx="7" cy="10" r="2" fill="currentColor"/>
<circle cx="12" cy="15" r="2" fill="currentColor"/>
<circle cx="12" cy="20" r="2" fill="currentColor"/>
<circle cx="17" cy="15" r="2" fill="currentColor"/>
<circle cx="7" cy="15" r="2" fill="currentColor"/>
</svg>
`

export default (props) => {
  return (
    <AspectRatio ratio={1 / 1} size={props.size}>
      <SvgXml xml={xml} width="100%" height="100%" color={props.style.color} />
    </AspectRatio>
  )
}
