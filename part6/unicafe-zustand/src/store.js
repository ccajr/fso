import { create } from 'zustand'

const updateFeedback = (state, type) => {
  const goodCounter = state.goodCounter + (type === 'good' ? 1 : 0)
  const neutralCounter = state.neutralCounter + (type === 'neutral' ? 1 : 0)
  const badCounter = state.badCounter + (type === 'bad' ? 1 : 0)
  const allCounter = state.allCounter + 1

  return {
    goodCounter,
    neutralCounter,
    badCounter,
    allCounter,
    averageCounter: (goodCounter - badCounter) / allCounter,
    positiveCounter: (goodCounter * 100) / allCounter,
  }
}

const useFeedbackStore = create(set => ({
  goodCounter: 0,
  neutralCounter: 0,
  badCounter: 0,
  allCounter: 0,
  averageCounter: 0,
  positiveCounter: 0,
  actions: {
    good: () => set(state => updateFeedback(state, 'good')),
    neutral: () => set(state => updateFeedback(state, 'neutral')),
    bad: () => set(state => updateFeedback(state, 'bad'))
  }
}))

export const useGoodCounter = () => useFeedbackStore(state => state.goodCounter)
export const useNeutralCounter = () => useFeedbackStore(state => state.neutralCounter)
export const useBadCounter = () => useFeedbackStore(state => state.badCounter)
export const useAllCounter = () => useFeedbackStore(state => state.allCounter)
export const useAverageCounter = () => useFeedbackStore(state => state.averageCounter)
export const usePositiveCounter = () => useFeedbackStore(state => state.positiveCounter)
export const useFeedbackControls = () => useFeedbackStore(state => state.actions)

export default useFeedbackStore