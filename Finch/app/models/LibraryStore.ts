import { cast, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const LibraryStoreModel = types
  .model("LibraryStore")
  .props({
    useCaseFilter: types.maybe(types.string),
    useCases: types.maybe(types.array(types.string)),
    // listSearch: types.maybe(types.string),

  })
  .views((store) => ({
    // get viewLimit() {
    //   return 100
    // },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    setUseCaseFilter(useCaseFilter: string) {
      store.useCaseFilter = useCaseFilter
    },
    setUseCases(useCases: string[]) {
      store.useCases = cast(useCases)
    },
  }))

export interface LibraryStore extends Instance<typeof LibraryStoreModel> {}
export interface LibraryStoreSnapshot extends SnapshotOut<typeof LibraryStoreModel> {}
