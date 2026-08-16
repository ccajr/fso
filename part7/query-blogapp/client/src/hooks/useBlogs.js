import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import useNotification from './useNotification'

export const useBlogs = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      notify(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        'success',
      )
    },
    onError: (error) => {
      notify(error.message, 'error')
    },
  })

  return {
    blogs: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addBlog: (blog) => newBlogMutation.mutate(blog),
  }
}
