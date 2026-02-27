import { render, screen } from '@testing-library/react'
import { PostList } from './PostList'
import type { Post } from '../types/post'

const mockPosts: Post[] = [
  {
    id: '1',
    content: '1つ目の投稿',
    authorName: 'ユーザーA',
    createdAt: '2024-01-01T00:00:00Z',
    likeCount: 0,
  },
  {
    id: '2',
    content: '2つ目の投稿',
    authorName: 'ユーザーB',
    createdAt: '2024-01-02T00:00:00Z',
    likeCount: 5,
  },
]

describe('PostList', () => {
  it('投稿が複数ある場合、全件表示される', () => {
    render(<PostList posts={mockPosts} />)
    expect(screen.getByText('1つ目の投稿')).toBeInTheDocument()
    expect(screen.getByText('2つ目の投稿')).toBeInTheDocument()
  })

  it('投稿が0件の場合、メッセージが表示される', () => {
    render(<PostList posts={[]} />)
    expect(screen.getByText('投稿がありません')).toBeInTheDocument()
  })
})
