import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  id: '69f9ba2cb4542c4a02214e76',
  title: "You're NOT gonna need it!",
  author: 'Ron Jeffries',
  url: 'https://ronjeffries.com/xprog/articles/practices/pracnotneed',
  likes: 123,
  user: {
    username: 'root',
    name: 'Superuser',
    id: '69f9ba1bb4542c4a02214e72',
  },
}

describe('<Blog />', () => {
  test("renders the blog's information to unauthenticated users, buttons are not displayed", () => {
    const { container } = render(<Blog blog={blog} />)

    const titleAndAuthor = screen.getByText(`${blog.author}: ${blog.title}`)
    expect(titleAndAuthor).toBeVisible()

    const likes = screen.queryByText(`likes ${blog.likes}`)
    expect(likes).toBeVisible()

    const url = container.querySelector('.url')
    expect(url).toBeVisible()

    const like = screen.queryByRole('button', { name: 'like' })
    expect(like).toBeNull()

    const remove = screen.queryByRole('button', { name: 'remove' })
    expect(remove).toBeNull()
  })

  test("shows the blog's information and like button to authenticated users who are not the blog's creator", async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      id: '6a05808c6787740493d742fa',
    }

    const { container } = render(<Blog blog={blog} user={newUser} />)

    const titleAndAuthor = screen.getByText(`${blog.author}: ${blog.title}`)
    expect(titleAndAuthor).toBeVisible()

    const likes = screen.queryByText(`likes ${blog.likes}`)
    expect(likes).toBeVisible()

    const url = container.querySelector('.url')
    expect(url).toBeVisible()

    const like = screen.queryByRole('button', { name: 'like' })
    expect(like).toBeVisible()

    const remove = screen.queryByRole('button', { name: 'remove' })
    expect(remove).toBeNull()
  })

  test("shows the blog's information, like, and remove buttons to the blog's creator", async () => {
    const { container } = render(<Blog blog={blog} user={blog.user} />)

    const titleAndAuthor = screen.getByText(`${blog.author}: ${blog.title}`)
    expect(titleAndAuthor).toBeVisible()

    const likes = screen.queryByText(`likes ${blog.likes}`)
    expect(likes).toBeVisible()

    const url = container.querySelector('.url')
    expect(url).toBeVisible()

    const like = screen.queryByRole('button', { name: 'like' })
    expect(like).toBeVisible()

    const remove = screen.queryByRole('button', { name: 'remove' })
    expect(remove).toBeVisible()
  })

  test('after clicking like button twice, the event handler the component received as props is called twice', async () => {
    const updateBlog = vi.fn()
    render(<Blog blog={blog} updateBlog={updateBlog} user={blog.user} />)

    const user = userEvent.setup()
    const likeButton = screen.queryByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
