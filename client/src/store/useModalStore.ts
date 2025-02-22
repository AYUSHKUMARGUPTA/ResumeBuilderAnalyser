import { create } from 'zustand'

interface StoreState {
  currentModal: string
  setCurrentModal: (str: string) => void
  rowData: any
  setRowData: (data: any) => void
}

export const useModalStore = create<StoreState>((set) => ({
  currentModal: '',
  setCurrentModal: (str) => set({ currentModal: str }),
  rowData: {},
  setRowData: (data) => set({ rowData: data })
}))
