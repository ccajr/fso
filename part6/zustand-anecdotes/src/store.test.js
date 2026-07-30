import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    update: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useFilter, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Test', votes: 18 }]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    expect(useAnecdoteStore.getState().anecdotes).toEqual(mockAnecdotes)
  })

  it('component displaying anecdotes receives the anecdotes from the store sorted by votes', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'Third based on votes', votes: 2 },
      { id: 2, content: 'First', votes: 23 },
      { id: 3, content: 'Second', votes: 8 }
    ]
    const sortedMockAnecdotes = [
      mockAnecdotes[1], mockAnecdotes[2], mockAnecdotes[0]
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(sortedMockAnecdotes)
  })
})

describe('useAnecdotes filtering', () => {
  const anecdotes = [
    { id: 1, content: 'This is a target anecdote', votes: 2 },
    { id: 2, content: 'Not this', votes: 23 },
    { id: 3, content: 'Not this one either', votes: 1 },
    { id: 4, content: 'Also a target', votes: 8 },
  ]

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes })
  })

  it('returns all anecdotes with no filter', () => {
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(4)
  })

  it(`filters 'target' anecdotes`, () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'target' })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(2)
    expect(result.current[0]).toEqual(anecdotes[0])
    expect(result.current[1]).toEqual(anecdotes[3])
  })
})