import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ColorType } from "native-base/lib/typescript/components/types"
import { IconTypes } from "../components"
import { translate, TxKeyPath } from "../i18n"
import { ConversationStatusEnum } from "./Conversation"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const ConversationStoreModel = types
  .model("ConversationStore")
  .props({
    inboxView: types.maybe(types.string),
    inboxSearch: types.maybe(types.string),
  })
  .views((store) => ({
    get viewLimit() {
      return 15
    },
    get inboxViewTx() {

      let inboxKeyPath: TxKeyPath = "inbox.activeHeader"

      if (store.inboxView === ConversationStatusEnum.CLOSED) {
        inboxKeyPath = "inbox.completedHeader"
      } else if (store.inboxView === ConversationStatusEnum.UNREAD) {
        inboxKeyPath = "inbox.unreadHeader"
      }
      return translate(inboxKeyPath)

    },
    get noDataTitleTx() {
      let inboxKeyPath: TxKeyPath = "inbox.noActiveTitle"

      if (store.inboxSearch) {
        inboxKeyPath = "inbox.noSearchTitle"
      } else if (store.inboxView === ConversationStatusEnum.CLOSED) {
        inboxKeyPath = "inbox.noCloseTitle"
      } else if (store.inboxView === ConversationStatusEnum.UNREAD) {
        inboxKeyPath = "inbox.noUnreadTitle"
      }


      return translate(inboxKeyPath)
    },
    get noDataDescriptionTx() {
      let inboxKeyPath: TxKeyPath = "inbox.noActiveDescription"

      if (store.inboxSearch) {
        inboxKeyPath = "inbox.noSearchDescription"
      } else if (store.inboxView === ConversationStatusEnum.CLOSED) {
        inboxKeyPath = "inbox.noCloseDescription"
      } else if (store.inboxView === ConversationStatusEnum.UNREAD) {
        inboxKeyPath = "inbox.noUnreadDescription"
      }
      return translate(inboxKeyPath)
    },
    get noDataIcon() {
      let iconName: IconTypes = "sparkles"

      if (store.inboxSearch) {
        iconName = "magnifyingGlass"
      } else if (store.inboxView === ConversationStatusEnum.CLOSED) {
        iconName = "checkCircle"
      } else if (store.inboxView === ConversationStatusEnum.UNREAD) {
        iconName = "rocketLaunch"
      }
      return iconName
    },
    get noDataColorScheme() {
      let iconName: ColorType = "green"

      if (store.inboxSearch) {
        iconName = "amber"
      } else if (store.inboxView === ConversationStatusEnum.CLOSED) {
        iconName = "gray"
      } else if (store.inboxView === ConversationStatusEnum.UNREAD) {
        iconName = "primary"
      }
      return iconName
    },
    get inboxViewEnum(): ConversationStatusEnum {

      let viewEnum: ConversationStatusEnum = ConversationStatusEnum.OPEN

      if (store.inboxView === ConversationStatusEnum.CLOSED) {
        viewEnum = ConversationStatusEnum.CLOSED
      } else if (store.inboxView === ConversationStatusEnum.UNREAD) {
        viewEnum = ConversationStatusEnum.UNREAD
      }

      return viewEnum

    },
    get isViewingUnread() {
      return store.inboxView === ConversationStatusEnum.UNREAD
    },
    get isViewingClosed() {
      return store.inboxView === ConversationStatusEnum.CLOSED
    },
    get isViewingOpen() {
      return store.inboxView === ConversationStatusEnum.OPEN
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    setInboxView(inboxView: string) {
      store.inboxView = inboxView
    },
    setInboxSearch(inboxSearch: string) {
      store.inboxSearch = inboxSearch
    },
  }))

export interface ConversationStore extends Instance<typeof ConversationStoreModel> {}
export interface ConversationStoreSnapshot extends SnapshotOut<typeof ConversationStoreModel> {}
