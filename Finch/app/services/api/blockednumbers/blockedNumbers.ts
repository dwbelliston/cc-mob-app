

export interface IBlockedNumbersListFilterProps {
  search?: string
}


export const blockedNumbersKeys = {
  all: ["blockedNumbers"] as const,
  lists: () => [...blockedNumbersKeys.all, 'list'] as const,
  list: (filters: IBlockedNumbersListFilterProps) => [...blockedNumbersKeys.lists(), filters] as const,
}
