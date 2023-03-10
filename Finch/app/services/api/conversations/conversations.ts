import { ConversationStatusEnum } from "../../../models/Conversation"



export interface IConversationListFilterProps {
  pageLimit: number
  search: string | null
  isUnread: boolean | null
  fromFolderId: string | null
  conversationStatus: ConversationStatusEnum | null
}



export const conversationKeys = {
  all: ["conversations"] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (filters: IConversationListFilterProps) => [...conversationKeys.lists(), filters] as const,
  streams: () => [...conversationKeys.all, 'streams'] as const,
  stream: (id: string, search: string | null) => [...conversationKeys.streams(),id,  search ] as const,
  // stream: (id: string, filters?: IConversatioStreamFilterProps) => [...conversationKeys.streams(),id,  filters ] as const,
  getUnreadCount: () => [...conversationKeys.all, 'count-unread'] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
}
