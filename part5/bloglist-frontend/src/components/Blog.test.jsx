import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  id: '69f9ba2cb4542c4a02214e76',
  title: 'You\'re NOT gonna need it!',
  author: 'Ron Jeffries',
  url: 'https://ronjeffries.com/xprog/articles/practices/pracnotneed',
  likes: 123,
  user: {
    username: 'root',
    name: 'Superuser',
    id: '69f9ba1bb4542c4a02214e72'
  }
}

describe('<Blog />', () => {
  test('renders the blog\'s title and author but not the URL and number of likes', () => {
    const { container } = render(
      <Blog blog={blog} />
    )

    const titleAndAuthor = screen.getByText(`${blog.title} ${blog.author}`)
    expect(titleAndAuthor).toBeVisible()

    const likes = screen.queryByText(`likes ${blog.likes}`)
    expect(likes).toBeNull()

    const url = container.querySelector('.url')
    expect(url).toBeNull()
  })

  test('shows the blog\'s URL and number of likes when the button controlling the shown details has been clicked', async () => {
    const { container } = render(
      <Blog blog={blog} />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likes = screen.queryByText(`likes ${blog.likes}`)
    expect(likes).toBeVisible()

    const url = container.querySelector('.url')
    expect(url).toBeVisible()
  })

  test('after clicking like button twice, the event handler the component received as props is called twice', async () => {
    const updateBlog = vi.fn()
    render(
      <Blog blog={blog} updateBlog={updateBlog} />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})