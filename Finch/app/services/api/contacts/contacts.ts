import { IContactFilter } from "../../../models/Contact"


export interface IContactsListFilterProps {
  pageLimit: number
  filters?: IContactFilter[]
  isEnabled?: boolean
}


export const contactsKeys = {
  all: ["contacts"] as const,
  lists: () => [...contactsKeys.all, 'list'] as const,
  list: (filters: IContactsListFilterProps) => [...contactsKeys.lists(), filters] as const,
  details: () => [...contactsKeys.all, 'detail'] as const,
  detail: (id: string, isListVersions: boolean) => [...contactsKeys.details(), id, isListVersions] as const,
}
