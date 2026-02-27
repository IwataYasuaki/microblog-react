import { render, screen } from '@testing-library/react'
import { Post } from './Post'
import type { Post as PostType } from '../types/post'

const mockPost: PostType = {
  id: '1',
  content: 'はじめての投稿です',
  authorName: 'テストユーザー',
  createdAt: '2024-01-01T00:00:00Z',
  likeCount: 3,
}

describe('Post', () => {
  it('投稿の本文が表示される', () => {
    render(<Post post={mockPost} />)
    expect(screen.getByText('はじめての投稿です')).toBeInTheDocument()
  })

  it('投稿者名が表示される', () => {
    render(<Post post={mockPost} />)
    expect(screen.getByText('テストユーザー')).toBeInTheDocument()
  })

  it('いいね数が表示される', () => {
    render(<Post post={mockPost} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('投稿日時が表示される', () => {
    render(<Post post={mockPost} />)
    expect(screen.getByText('2024/1/1')).toBeInTheDocument()
  })
})
