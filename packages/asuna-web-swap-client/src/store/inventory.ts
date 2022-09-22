import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TraitType, TraitData } from 'asuna-data'

const data = require('asuna-data/metadata/normalized-metadata.json')

type InventoryState = {
  selected: {
    [tokenId: string]: boolean
  },
  tokens: {
    [tokenId: string]: {
      id: number
      traits: TraitData
    }
  }
}

const initialState: InventoryState = {
  selected: {},
  tokens: {}
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
      else if (Object.keys(state.selected).length >= 2) {
        return state
      } else {
        return {
          ...state,
          selected: {
            ...state.selected,
            [action.payload]: true
          }
        }
      }
    },
    addToken: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        tokens: {
          ...state.tokens,
          [action.payload]: {
            id: action.payload,
            traits: data[action.payload].traitData
          }
        }
      }
    },
    swapTrait: (state, action: PayloadAction<{ id1: number, id2: number, trait: TraitType }>) => {
      const temp = state.tokens[action.payload.id1].traits[action.payload.trait]
      state.tokens[action.payload.id1].traits[action.payload.trait] = state.tokens[action.payload.id2].traits[action.payload.trait]
      state.tokens[action.payload.id2].traits[action.payload.trait] = temp
    }
  }
})

export const { toggleSelected, addToken, swapTrait } = Inventory.actions
export default Inventory.reducer