import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

export const useUsers = () => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  })

  return {
    users: result.data,
    isPending: result.isPending,
    isError: result.isError,
  }
}
