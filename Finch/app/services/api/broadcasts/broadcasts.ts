import { BroadcastStatusEnum } from "../../../models/Broadcast"


export interface IBroadcastsListFilterProps {
  pageLimit: number
  // search: string | null
  status?: BroadcastStatusEnum | null
}


export const broadcastsKeys = {
  all: ["broadcasts"] as const,
  lists: () => [...broadcastsKeys.all, 'list'] as const,
  list: (filters: IBroadcastsListFilterProps) => [...broadcastsKeys.lists(), filters] as const,
  details: () => [...broadcastsKeys.all, 'detail'] as const,
  detail: (id: string) => [...broadcastsKeys.details(), id] as const,
}
