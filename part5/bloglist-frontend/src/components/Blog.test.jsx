import { render, screen } from '@testing-library/react'
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
})