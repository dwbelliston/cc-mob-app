import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ColorType } from "native-base/lib/typescript/components/types"
import { IconTypes } from "../components"
import { translate, TxKeyPath } from "../i18n"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const ContactsStoreModel = types
  .model("ContactsStore")
  .props({
    contactsSearch: types.maybe(types.string),
    isHeaderSearchOpen: types.maybe(types.boolean),
  })
  .views((store) => ({
    get viewLimit() {
      return 15
    },

    get noDataTitleTx() {
      let keyPath: TxKeyPath = "contacts.noDataTitle"

      if (store.contactsSearch) {
        keyPath = "contacts.noSearchTitle"
      }
      return translate(keyPath)
    },
    get noDataDescriptionTx() {
      let keyPath: TxKeyPath = "contacts.noDataDescription"

      if (store.contactsSearch) {
        keyPath = "contacts.noSearchDescription"
      }

      return translate(keyPath)
    },
    get noDataIcon() {
      let iconName: IconTypes = "contacts"

      if (store.contactsSearch) {
        iconName = "magnifyingGlass"
      }
      return iconName
    },
    get noDataColorScheme() {
      let iconName: ColorType = "primary"

      if (store.contactsSearch) {
        iconName = "amber"
      }
      return iconName
    },

  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    setContactsSearch(contactsSearch: string) {
      store.contactsSearch = contactsSearch
    },
    setIsHeaderSearchOpen(isOpen: boolean) {
      store.isHeaderSearchOpen = isOpen
    },
  }))

export interface ContactsStore extends Instance<typeof ContactsStoreModel> {}
export interface ContactsStoreSnapshot extends SnapshotOut<typeof ContactsStoreModel> {}
