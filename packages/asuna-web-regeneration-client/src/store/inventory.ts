import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TraitType, TraitData, TokenData } from 'asuna-data'

type InventoryState = {
  loaded: boolean,
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
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload
      if (action.payload === false) {
        state.selected = {}
      }
    },
    setInventory: (state, action: PayloadAction<InventoryState['inventory']>) => {
      state.selected = {}
      state.inventory = action.payload
    },
    swapTrait: (state, action: PayloadAction<{ id1: number, id2: number, trait: TraitType }>) => {
      // const temp = state.tokens[action.payload.id1].traits[action.payload.trait]
      // state.tokens[action.payload.id1].traits[action.payload.trait] = state.tokens[action.payload.id2].traits[action.payload.trait]
      // state.tokens[action.payload.id2].traits[action.payload.trait] = temp
    }
  }
})

export const { toggleSelected, setLoaded, setInventory, swapTrait } = Inventory.actions
export default Inventory.reducer