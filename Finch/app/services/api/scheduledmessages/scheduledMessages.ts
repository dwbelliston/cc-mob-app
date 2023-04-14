export interface ISchedulesMessagesListFilterProps {
  pageLimit: number
  search: string | null
  isShowScheduledOnly: boolean | null
}

export const scheduledMessagesKeys = {
  all: ["scheduledMessages"] as const,
  lists: () => [...scheduledMessagesKeys.all, 'list'] as const,
  list: (filters: ISchedulesMessagesListFilterProps) => [...scheduledMessagesKeys.lists(), filters] as const,
  numbers: () => [...scheduledMessagesKeys.all, 'numbers'] as const,
  number: (contactNumber: string) => [...scheduledMessagesKeys.numbers(),contactNumber ] as const,
  details: () => [...scheduledMessagesKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduledMessagesKeys.details(), id] as const,
}
