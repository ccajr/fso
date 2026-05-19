import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('when a new blog is created, the form calls the event handler it received as props with the right details', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(
      <BlogForm createBlog={createBlog} />
    )

    const titleVal = 'You\'re NOT gonna need it!'
    const authorVal = 'Ron Jeffries'
    const urlVal = 'https://ronjeffries.com/xprog/articles/practices/pracnotneed'

    const title = screen.getByLabelText('title:')
    const author = screen.getByLabelText('author:')
    const url = screen.getByLabelText('url:')
    const button = screen.getByRole('button')

    await user.type(title, titleVal)
    await user.type(author, authorVal)
    await user.type(url, urlVal)
    await user.click(button)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(titleVal)
    expect(createBlog.mock.calls[0][0].author).toBe(authorVal)
    expect(createBlog.mock.calls[0][0].url).toBe(urlVal)
  })
})