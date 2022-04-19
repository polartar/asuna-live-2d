import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TraitType, TokenData } from 'asuna-data'

type InventoryState = {
  loaded: boolean, // indicates whether InventoryPage will request api for inventory
  selected: {
    [tokenId: string]: TokenData
  },
  inventory: {
    [tokenId: string]: TokenData
  }
}

const initialState: InventoryState = {
  loaded: false,
  selected: {},
  inventory: {}
}

export const Inventory = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    toggleSelected: (state, action: PayloadAction<number>) => {
      if (action.payload in state.selected) {
        let next = {
          ...state,
          selected: {
            ...state.selected
          }
        }
        delete next.selected[action.payload]
        return next
      }
      else if (!(action.payload in state.inventory)) {
        return state
      } else if (Object.keys(state.selected).length >= 2) {
        return state
      } else {
        return {
          ...state,
          selected: {
            ...state.selected,
            [action.payload]: JSON.parse(JSON.stringify(state.inventory[action.payload]))
          }
        }
      }
    },
    clearSelected: (state) => {
      state.selected = {}
    },
    restoreSelected: (state) => {
      for (let id of Object.keys(state.selected)) {
        state.selected[id] = JSON.parse(JSON.stringify(state.inventory[id]))
      }
    },
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload
    },
    setInventory: (state, action: PayloadAction<InventoryState['inventory']>) => {
      state.inventory = action.payload
    },
    swapTrait: (state, action: PayloadAction<{ id1: number, id2: number, trait: TraitType }>) => {
      if (!(action.payload.id1 in state.selected && action.payload.id2 in state.selected)) {
        return
      }

      const temp = state.selected[action.payload.id1].traitData[action.payload.trait]
      state.selected[action.payload.id1].traitData[action.payload.trait] = state.selected[action.payload.id2].traitData[action.payload.trait]
      state.selected[action.payload.id2].traitData[action.payload.trait] = temp
    }
  }
})

export const { toggleSelected, clearSelected, restoreSelected, setLoaded, setInventory, swapTrait } = Inventory.actions
export default Inventory.reducer