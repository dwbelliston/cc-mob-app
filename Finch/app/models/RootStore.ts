import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { AuthenticationStoreModel } from "./AuthenticationStore";
import { BroadcastsStoreModel } from './BroadcastsStore';
import { ContactsStoreModel } from "./ContactsStore";
import { ConversationStoreModel } from "./ConversationStore";
import { LibraryStoreModel } from "./LibraryStore";

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
    authenticationStore: types.optional(AuthenticationStoreModel, {}),
    conversationStore: types.optional(ConversationStoreModel, {}),
    contactsStore: types.optional(ContactsStoreModel, {}),
    broadcastsStore: types.optional(BroadcastsStoreModel, {}),
    libraryStore: types.optional(LibraryStoreModel, {}),
  })


/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
