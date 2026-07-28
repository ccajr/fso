import { create } from 'zustand'

const useNotificationStore = create((set, get) => ({
  message: null,
  actions: {
    displayNotification: message => {
      set(() => ({ message }))
      setTimeout(() => {
        if (message === get().message) {
          set(() => ({ message: null }))
        }
      }, 5000)
    }
  }
}))

export const useNotification = () => useNotificationStore(state => state.message)
export const useNotificationActions = () => useNotificationStore(state => state.actions)