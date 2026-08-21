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

  const likeMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((b) => (updatedBlog.id === b.id ? updatedBlog : b)),
      )
      notify(
        `blog ${updatedBlog.title} by ${updatedBlog.author} liked`,
        'success',
      )
    },
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (data, variables) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((b) => variables.id !== b.id),
      )
      notify(
        `blog ${variables.title} by ${variables.author} removed`,
        'success',
      )
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: (updatedBlog, variables) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((b) => (updatedBlog.id === b.id ? updatedBlog : b)),
      )
      notify(`comment '${variables.commentObject.content}' added`, 'success')
    },
  })

  return {
    blogs: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addBlog: (blog) => newBlogMutation.mutate(blog),
    like: (blog) => likeMutation.mutate({ ...blog, likes: blog.likes + 1 }),
    removeBlog: (blog) => removeBlogMutation.mutate(blog),
    addComment: addCommentMutation.mutate,
  }
}
