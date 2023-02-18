import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { translate, TxKeyPath } from "../i18n"
import { ConversationStatusEnum } from "./Conversation"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const ConversationStoreModel = types
  .model("ConversationStore")
  .props({
    inboxView: types.maybe(types.string),
  })
  .views((store) => ({
    get inboxViewTx() {

      let inboxKeyPath: TxKeyPath = "inbox.active"
      // Auth.currentSession().then(res => console.log(res.getAccessToken().getJwtToken()))
      if (store.inboxView === ConversationStatusEnum.CLOSED) {
        inboxKeyPath = "inbox.completed"
      } else if (store.inboxView === ConversationStatusEnum.UNREAD) {
        inboxKeyPath = "inbox.unread"
      }
      return translate(inboxKeyPath)

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
  }))

export interface ConversationStore extends Instance<typeof ConversationStoreModel> {}
export interface ConversationStoreSnapshot extends SnapshotOut<typeof ConversationStoreModel> {}
