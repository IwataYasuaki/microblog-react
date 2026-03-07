import { render, screen } from '@testing-library/react'
import { PostList } from './PostList'
import type { Post } from '@microblog/shared'

const mockPost = (overrides?: Partial<Post>): Post => ({
  id: '1',
  content: '1つ目の投稿',
  authorName: 'ユーザーA',
  createdAt: '2024-01-01T00:00:00Z',
  likeCount: 0,
  likedByMe: false,
  ...overrides,
})

describe('PostList', () => {
  it('投稿が複数ある場合、全件表示される', () => {
    render(
      <PostList
        posts={[
          mockPost({ id: '1', content: '1つ目の投稿' }),
          mockPost({ id: '2', content: '2つ目の投稿' }),
        ]}
        onLike={vi.fn()}
        onUnlike={vi.fn()}
      />
    )
    expect(screen.getByText('1つ目の投稿')).toBeInTheDocument()
    expect(screen.getByText('2つ目の投稿')).toBeInTheDocument()
  })

  it('投稿が0件の場合、メッセージが表示される', () => {
    render(<PostList posts={[]} onLike={vi.fn()} onUnlike={vi.fn()} />)
    expect(screen.getByText('投稿がありません')).toBeInTheDocument()
  })

  it('いいね済みの投稿はいいね済みボタンが表示される', () => {
    render(
      <PostList
        posts={[mockPost({ likedByMe: true })]}
        onLike={vi.fn()}
        onUnlike={vi.fn()}
      />
    )
    expect(
      screen.getByRole('button', { name: 'いいね済み' })
    ).toBeInTheDocument()
  })
})
