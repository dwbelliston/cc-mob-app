export interface IRollCallUpdate {
  ViewingConversation?: any
  Online?: any
  Status?: any
}

export interface IRollCallCreate extends IRollCallUpdate {}
export interface IRollCallCreateViewerStatus {
  ConversationId: string
  IsTyping: boolean
  ViewedTime: string
}

export interface IRollCall extends IRollCallUpdate {
  ViewingConversation: { [name: string]: IRollCallCreateViewerStatus }
  Online: { [name: string]: string }
  Status: any
}

export const initialRollCallForm: IRollCallUpdate = {
  ViewingConversation: {},
  Online: {},
  Status: {},
}

export interface IRollCallConversationUpdate {
  ConversationId?: any
  IsTyping?: boolean
}
