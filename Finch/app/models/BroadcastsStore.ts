import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ColorType } from "native-base/lib/typescript/components/types"
import { IconTypes } from "../components"
import { translate, TxKeyPath } from "../i18n"
import { BroadcastStatusEnum } from "./Broadcast"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const BroadcastsStoreModel = types
  .model("BroadcastsStore")
  .props({
    listView: types.maybe(types.string),
    // listSearch: types.maybe(types.string),

  })
  .views((store) => ({
    get viewLimit() {
      return 15
    },
    get listviewText() {

      let inboxKeyPath: TxKeyPath = "broadcasts.activeHeader"

      if (store.listView === BroadcastStatusEnum.COMPLETED) {
        inboxKeyPath = "broadcasts.completedHeader"
      } else if (store.listView === BroadcastStatusEnum.ARCHIVED) {
        inboxKeyPath = "broadcasts.archivedHeader"
      } else if (store.listView === BroadcastStatusEnum.DRAFT) {
        inboxKeyPath = "broadcasts.draftHeader"
      }

      return translate(inboxKeyPath)

    },
    get noDataTitleTx() {
      let inboxKeyPath: TxKeyPath = "broadcasts.noActiveTitle"

      if (store.listView === BroadcastStatusEnum.COMPLETED) {
        inboxKeyPath = "broadcasts.noCompletedTitle"
      } else if (store.listView === BroadcastStatusEnum.ARCHIVED) {
        inboxKeyPath = "broadcasts.noArchivedTitle"
      } else if (store.listView === BroadcastStatusEnum.DRAFT) {
        inboxKeyPath = "broadcasts.noDraftTitle"
      }


      return translate(inboxKeyPath)
    },
    get noDataDescriptionTx() {
      let inboxKeyPath: TxKeyPath = "broadcasts.noActiveTitle"

      if (store.listView === BroadcastStatusEnum.COMPLETED) {
        inboxKeyPath = "broadcasts.noCompletedTitle"
      } else if (store.listView === BroadcastStatusEnum.ARCHIVED) {
        inboxKeyPath = "broadcasts.noArchivedTitle"
      } else if (store.listView === BroadcastStatusEnum.DRAFT) {
        inboxKeyPath = "broadcasts.noDraftTitle"
      }


      return translate(inboxKeyPath)
    },
    get noDataIcon() {
      let iconName: IconTypes = "play"

      if (store.listView === BroadcastStatusEnum.COMPLETED) {
        iconName = "check"
      } else if (store.listView === BroadcastStatusEnum.ARCHIVED) {
        iconName = "archiveBox"
      } else if (store.listView === BroadcastStatusEnum.DRAFT) {
        iconName = "pencil"
      }
      return iconName
    },
    get noDataColorScheme() {
      let colorScheme: ColorType = "green"

      if (store.listView === BroadcastStatusEnum.COMPLETED) {
        colorScheme = "gray"
      } else if (store.listView === BroadcastStatusEnum.ARCHIVED) {
        colorScheme = "red"
      } else if (store.listView === BroadcastStatusEnum.DRAFT) {
        colorScheme = "primary"
      }


      return colorScheme
    },
    get listViewStatusEnum(): BroadcastStatusEnum {

      let viewEnum: BroadcastStatusEnum = BroadcastStatusEnum.ACTIVE

      if (store.listView == BroadcastStatusEnum.DRAFT) {
        viewEnum = BroadcastStatusEnum.DRAFT
      } else if (store.listView === BroadcastStatusEnum.COMPLETED) {
        viewEnum = BroadcastStatusEnum.COMPLETED
      } else if (store.listView === BroadcastStatusEnum.ARCHIVED) {
        viewEnum = BroadcastStatusEnum.ARCHIVED
      }

      return viewEnum

    },
    // get isViewingUnread() {
    //   return store.listView === BroadcastStatusEnum.UNREAD
    // },
    // get isViewingClosed() {
    //   return store.listView === BroadcastStatusEnum.CLOSED
    // },
    // get isViewingOpen() {
    //   return store.listView === BroadcastStatusEnum.OPEN
    // },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    setListView(listView: string) {
      store.listView = listView
    },
  }))

export interface BroadcastsStore extends Instance<typeof BroadcastsStoreModel> {}
export interface BroadcastsStoreSnapshot extends SnapshotOut<typeof BroadcastsStoreModel> {}
