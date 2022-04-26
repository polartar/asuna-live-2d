import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum ModalPage {
  None,
  Approval
}

type ModalState = {
  show: boolean
  page: ModalPage
  wait: Promise<void> | null
  resolve: null | (() => void)
  reject: null | (() => void)
  error: string | Error | null
}

const initialState: ModalState = {
  show: false,
  page: ModalPage.None,
  wait: null,
  resolve: null,
  reject: null,
  error: null
}

export const Modal = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<ModalPage>) => {
      state.page = action.payload
    },
    setError: (state, action: PayloadAction<ModalState['error']>) => {
      state.error = action.payload
    },
    setShow: (state, action: PayloadAction<boolean>) => {
      if (state.show === action.payload) return

      state.show = action.payload

      if (action.payload) {
        state.error = null
        state.wait = new Promise((resolve, reject) => {
          state.resolve = resolve
          state.reject = reject
        })
      } else {
        if (state.error !== null) {
          if (state.reject !== null) {
            state.reject()
          }
        } else {
          if (state.resolve !== null) {
            state.resolve()
          }
        }
        state.wait = null
        state.resolve = null
        state.reject = null
        state.page = ModalPage.None
      }
    }
  }
})

export const ModalActions = Modal.actions
export default Modal.reducer
